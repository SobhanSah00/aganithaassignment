import { Prisma } from "@/app/generated/prisma/client"
import { prisma } from "@/database/db"
import { generateCode } from "@/lib/generateCode"
import { createLinkValidation } from "@/lib/validation"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        console.log(body);


        const validated = createLinkValidation.safeParse(body)
        
        if (!validated.success) {
            return NextResponse.json(
                { error: validated.error.message },
                { status: 400 }
            )
        }

        const { targetUrl, code: customCode } = validated.data

        console.log("targetUrl,code :", targetUrl, customCode);


        let code = customCode

        if (!code) {
            let attempts = 0
            let isUnique = false

            while (!isUnique && attempts < 10) {
                code = generateCode(6)
                const existing = await prisma.link.findUnique({
                    where: { code },
                })
                isUnique = !existing
                attempts++
            }

            if (!isUnique) {
                return NextResponse.json(
                    { error: 'Failed to generate unique code' },
                    { status: 500 }
                )
            }
        }

        const link = await prisma.link.create({
            data: {
                code: code!,
                targetUrl,
            },
        })

        return NextResponse.json(link, { status: 201 })

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json(
                    { error: 'Code already exists', stausCode: 409 },
                    { status: 409 }
                )
            }
        }

        console.error('Error creating link:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const links = await prisma.link.findMany({
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(links)
    } catch (error) {
        console.error('Error fetching links:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}