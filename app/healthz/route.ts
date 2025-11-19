import { NextResponse } from 'next/server'
import { prisma } from '@/database/db'

export async function GET() {
    try {
        await prisma.$queryRaw`SELECT 1`

        return NextResponse.json({
            status: 200,
            ok: true,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: 'connected',
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