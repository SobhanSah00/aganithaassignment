import { NextResponse } from 'next/server'
import { prisma } from '@/database/db'

export async function GET() {
    try {
        await prisma.$queryRaw`SELECT 1`

        return NextResponse.json({

            ok: true,
            version: "1.0",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: 'connected',
            status: 200,
        })
    } catch (error: any) {
        return NextResponse.json(
            {
                ok: false,
                error: 'Database connection failed',
                database: 'disconnected'
            },
            { status: 503 }
        )
    }
}