'use client'

import { useState } from 'react'
import { Button } from './ui/Button'
import { Toast } from './ui/Toast'
import { Copy, ExternalLink, Trash2, BarChart3, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/formatDate'

interface LinkCardProps {
  link: {
    code: string
    targetUrl: string
    clicks: number
    createdAt: Date
    lastClickedAt: Date | null
  }
}

export function LinkCard({ link }: LinkCardProps) {
  console.log("alskdjffoasdjofjasdofj : ",link.code);
  
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${link.code}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error: any) {
      setToast({ message: 'Failed to copy', type: 'error' })
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this link?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/links/${link.code}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      setToast({ message: 'Link deleted successfully', type: 'success' })
      router.refresh()
    } catch (error: any) {
      setToast({ message: 'Failed to delete link', type: 'error' })
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all">
        <div className="flex items-start justify-between gap-4">
          {/* Left: URL Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <code className="text-sm font-mono font-semibold text-white">
                /{link.code}
              </code>
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


            <a href={link.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors flex items-center gap-1 group"
            >
              <span className="truncate max-w-md">{link.targetUrl}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity " />
            </a>
          </div>

          {/* Right: Stats & Actions */}
          <div className="flex items-center gap-3">
            {/* Stats */}
            <div className="text-right">
              <div className="text-sm font-semibold text-white">
                {link.clicks.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-500">clicks</div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Link href={`/code/${link.code}`}>
                <Button variant="ghost" size="sm">
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-800">
          <div className="text-xs text-zinc-500">
            Created {formatDate(link.createdAt)}
          </div>
          {link.lastClickedAt && (
            <div className="text-xs text-zinc-500">
              Last clicked {formatDate(link.lastClickedAt)}
            </div>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}