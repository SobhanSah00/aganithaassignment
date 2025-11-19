// components/links-list-client.tsx
'use client'

import { useEffect, useState } from 'react'
import { LinkCard } from './Link-card'
import { FileQuestion, Loader2 } from 'lucide-react'

interface Link {
  code: string
  targetUrl: string
  clicks: number
  createdAt: Date
  lastClickedAt: Date | null
}

export function LinksListClient() {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links', { cache: 'no-store' })
      const data = await res.json()
      setLinks(data)
    } catch (error) {
      console.error('Error fetching links:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()

    // Poll for updates every 3 seconds
    const interval = setInterval(fetchLinks, 3000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    )
  }

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
      {links.map((link) => (
        <LinkCard key={link.code} link={link} />
      ))}
    </div>
  )
}