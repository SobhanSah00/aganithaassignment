'use client'

import { useState } from 'react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Card } from './ui/Card'
import { Toast } from './ui/Toast'
import { Link, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CreateLinkForm() {
  const router = useRouter()
  const [targetUrl, setTargetUrl] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ targetUrl?: string; code?: string }>({})
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const validateCode = (c: string) => {
    if (!c) return true
    return /^[A-Za-z0-9]{6,8}$/.test(c)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setErrors({})

    const newErrors: { targetUrl?: string; code?: string } = {}

    if (!targetUrl) {
      newErrors.targetUrl = 'URL is required'
    } else if (!validateUrl(targetUrl)) {
      newErrors.targetUrl = 'Invalid URL format'
    }

    if (code && !validateCode(code)) {
      newErrors.code = 'Code must be 6-8 alphanumeric characters'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl,
          ...(code && { code }),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ code: 'This code is already taken' })
        } else {
          throw new Error(data.error || 'Failed to create link')
        }
        return
      }

      setToast({ message: 'Link created successfully!', type: 'success' })
      setTargetUrl('')
      setCode('')

      router.refresh()

    } catch (error: any) {
      setToast({
        message: error instanceof Error ? error.message : 'Something went wrong',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Target URL"
              placeholder="https://example.com/very-long-url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              error={errors.targetUrl}
              disabled={isLoading}
            />

            <Input
              label="Custom Code (optional)"
              placeholder="mylink"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              error={errors.code}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Link className="w-4 h-4 mr-2" />
                Create Short Link
              </>
            )}
          </Button>
        </form>
      </Card>

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