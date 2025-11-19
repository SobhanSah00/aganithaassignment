'use client'

import { ExternalLink, Check, Copy, BarChart3, TrendingUp, Calendar, MousePointer, Clock } from 'lucide-react'
import { useState, useMemo } from 'react'
import { formatDate } from '@/lib/formatDate'

interface DailyAnalytics {
  date: string
  count: number
}

interface LinkStatsProps {
  link: {
    code: string
    targetUrl: string
    clicks: number
    createdAt: Date
    lastClickedAt: Date | null
    analytics?: {
      totalEvents: number
      daily: DailyAnalytics[]
    }
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

  const analyticsData = useMemo(() => {
    if (!link.analytics?.daily) return []
    
    const dateMap = new Map<string, number>()
    link.analytics.daily.forEach(item => {
      const current = dateMap.get(item.date) || 0
      dateMap.set(item.date, current + item.count)
    })

    return Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [link.analytics])

  const maxClicks = Math.max(...analyticsData.map(d => d.count), 1)

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-6 h-6 text-zinc-400" />
          <h1 className="text-3xl font-bold">Link Statistics</h1>
        </div>
        <code className="text-lg text-zinc-400 font-mono">/{link.code}</code>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-sm text-zinc-500">Short URL</p>
              <button
                onClick={handleCopy}
                className="text-zinc-500 hover:text-white transition-colors"
                title="Copy short URL"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <code className="text-white break-all font-mono">{shortUrl}</code>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-4">
          <p className="text-sm text-zinc-500 mb-2">Target URL</p>
          <a
            href={link.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-zinc-300 transition-colors flex items-center gap-2 break-all group"
          >
            {link.targetUrl}
            <ExternalLink className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <MousePointer className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-sm text-zinc-500">Total Clicks</div>
          </div>
          <div className="text-3xl font-bold">{link.clicks.toLocaleString()}</div>
        </div>

       
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-sm text-zinc-500">Avg. Daily</div>
          </div>
          <div className="text-3xl font-bold">
            {analyticsData.length > 0 
              ? Math.round(link.clicks / analyticsData.length)
              : 0}
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-sm text-zinc-500">Created</div>
          </div>
          <div className="text-lg font-semibold">{formatDate(link.createdAt)}</div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-sm text-zinc-500">Last Clicked</div>
          </div>
          <div className="text-lg font-semibold">
            {link.lastClickedAt ? formatDate(link.lastClickedAt) : 'Never'}
          </div>
        </div>
      </div>

      {analyticsData.length > 0 && (
        <>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-zinc-400" />
              Daily Clicks
            </h3>
            <div className="space-y-3">
              {analyticsData.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-white font-semibold">{item.count}</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(item.count / maxClicks) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Peak Day</p>
                <p className="text-lg font-semibold text-white">
                  {Math.max(...analyticsData.map(d => d.count))}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Total Days</p>
                <p className="text-lg font-semibold text-white">
                  {analyticsData.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">First Click</p>
                <p className="text-lg font-semibold text-white">
                  {new Date(analyticsData[0].date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Latest Click</p>
                <p className="text-lg font-semibold text-white">
                  {new Date(analyticsData[analyticsData.length - 1].date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {(!analyticsData || analyticsData.length === 0) && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
          <BarChart3 className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-400 mb-2">No Analytics Data</h3>
          <p className="text-sm text-zinc-500">
            Analytics will appear here once people start clicking your link
          </p>
        </div>
      )}
    </div>
  )
}