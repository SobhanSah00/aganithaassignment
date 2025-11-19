// components/ui/toast.tsx
'use client'

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Fade in
    setTimeout(() => setIsVisible(true), 10)
    
    // Auto close after 3s
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === 'success' ? 'bg-green-900/90' : type === 'error' ? 'bg-red-900/90' : 'bg-zinc-900/90'
  const borderColor = type === 'success' ? 'border-green-700' : type === 'error' ? 'border-red-700' : 'border-zinc-700'

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm transition-all duration-300 ${bgColor} ${borderColor} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
    >
      <p className="text-sm text-white">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        className="text-zinc-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}