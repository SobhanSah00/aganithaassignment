import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/database/db'
import { codeValidation } from '@/lib/validation'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js"
import { revalidatePath } from 'next/cache'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params

    const validated = codeValidation.safeParse(code)
    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid code format' }, { status: 400 })
    }

    const link = await prisma.link.findUnique({
      where: { code },
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    const dailyStats = await prisma.clickEvent.groupBy({
      by: ["createdAt"],
      where: { linkCode: code },
      _count: { _all: true },
    })

    console.log("Daily Stats : ",dailyStats);
    

    const daily = dailyStats.map((item) => ({
      date: item.createdAt.toISOString().split("T")[0],
      count: item._count._all,
    }))
    console.log("Daily",daily);
    

    return NextResponse.json({
      ...link,
      analytics: {
        totalEvents: link.clicks,
        daily,
      }
    })

  } catch (error: any) {
    console.error('Error fetching link stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await context.params;
        const validated = codeValidation.safeParse(code)
        if (!validated.success) {
            return NextResponse.json(
                {
                    error: 'Invalid code format'

                },
                {
                    status: 400

                }
            )
        }

        const deleted = await prisma.link.delete({
            where: {
                code

            },
        })

        revalidatePath('/')

        return NextResponse.json({ success: true, deleted })

    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return NextResponse.json(
                    {
                        error: 'Link not found'

                    },
                    {
                        status: 404

                    }
                )
            }
        }

        console.error('Error deleting link:', error)
        return NextResponse.json(
            {
                error: 'Internal server error'

            },
            {
                status: 500

            }
        )
    }
}