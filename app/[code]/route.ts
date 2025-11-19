import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/database/db'
import { codeValidation } from '@/lib/validation'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ code: string }> }
) {
    const { code } = await context.params
    try {

        const validated = codeValidation.safeParse(code)
        if (!validated.success) {
            return new NextResponse(null, { status: 404 })
        }

        const link = await prisma.link.findUnique({
            where: {
                code
            },
            select: {
                targetUrl: true
            },
        })

        if (!link) {
            return new NextResponse(null, {
                status: 404
            })
        }

        const clickEvents = await prisma.clickEvent.create({
            data: { linkCode: code },
            select : {
                link : true,
                id : true
            }
        }).catch((err : any) => console.error("Error creating click event:", err));

        console.log(clickEvents);
        

        await prisma.link.update({
            where: {
                code
            },
            data: {
                clicks: {
                    increment: 1
                },
                lastClickedAt: new Date(),
            },
        }).catch((error: any) => {
            console.error('Error incrementing clicks:', error)
        })


        return NextResponse.redirect(link.targetUrl, { status: 302 })

    } catch (error: any) {
        console.error('Error redirecting:', error)
        return new NextResponse(null, { status: 404 })
    }
}