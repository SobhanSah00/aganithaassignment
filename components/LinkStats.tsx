'use client'

import { ExternalLink, Check, Copy, BarChart3 } from 'lucide-react'
import { useState } from 'react'
import { formatDate } from '@/lib/formatDate'

interface LinkStatsProps {
  link: {
    code: string
    targetUrl: string
    clicks: number
    createdAt: Date
    lastClickedAt: Date | null
  }
}

export function LinkStats({ link }: LinkStatsProps) {
  const [copied, setCopied] = useState(false)

  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${link.code}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 max-w-3xl mx-auto mt-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Stats for <code className="text-indigo-400">/{link.code}</code>
        </h2>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Short URL */}
      <div className="mb-4">
        <p className="text-zinc-500 text-xs mb-1">Short URL</p>
        <code className="text-indigo-300 break-all">{shortUrl}</code>
      </div>

      {/* Target URL */}
      <div className="mb-6">
        <p className="text-zinc-500 text-xs mb-1">Destination</p>
        <a
          href={link.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-300 hover:text-white flex items-center gap-1 group break-all"
        >
          {link.targetUrl}
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        {/* Click Count */}
        <div className="bg-zinc-800/40 border border-zinc-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{link.clicks}</div>
          <div className="text-xs text-zinc-500">Total Clicks</div>
        </div>

        {/* Created At */}
        <div className="bg-zinc-800/40 border border-zinc-700 rounded-lg p-4 text-center">
          <div className="text-sm text-zinc-300">{formatDate(link.createdAt)}</div>
          <div className="text-xs text-zinc-500">Created</div>
        </div>

        {/* Last Clicked */}
        <div className="bg-zinc-800/40 border border-zinc-700 rounded-lg p-4 text-center">
          <div className="text-sm text-zinc-300">
            {link.lastClickedAt ? formatDate(link.lastClickedAt) : '—'}
          </div>
          <div className="text-xs text-zinc-500">Last Clicked</div>
        </div>

      </div>

    </div>
  )
}
