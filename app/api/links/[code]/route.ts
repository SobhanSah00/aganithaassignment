import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/database/db'
import { codeValidation } from '@/lib/validation'
import { Prisma } from '@/app/generated/prisma/client'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ code: string }> }
) {
    try {


        const { code } = await context.params;

        const validated = codeValidation.safeParse(code)

        console.log("params code:", code);
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

        const link = await prisma.link.findUnique({
            where: {
                code
            },
        })

        if (!link) {
            return NextResponse.json(
                {
                    error: 'Link not found'
                },
                {
                    status: 404
                }
            )
        }

        return NextResponse.json(link)
    } catch (error) {
        console.error('Error fetching link:', error)
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

        return NextResponse.json({ success: true, deleted })

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
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