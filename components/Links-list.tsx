import { prisma } from '@/database/db'
import { LinkCard } from './Link-card'
import { FileQuestion } from 'lucide-react'

export async function LinksList() {
    const links = await prisma.link.findMany({
        orderBy: { createdAt: 'desc' },
    })

    if (links.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 mb-4">
                    <FileQuestion className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-2">No links yet</h3>
                <p className="text-sm text-zinc-500">Create your first short link above</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {links.map((link: any) => (
                <LinkCard key={link.code} link={link} />
            ))}
        </div>
    )
}