import { Suspense } from 'react'
import { LinksList } from '@/components/Links-list'
import { CreateLinkForm } from '@/components/Create-link-form'
import { Link as LinkIcon, Zap } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white rounded-md">
              <LinkIcon className="w-4 h-4 text-black" />
            </div>
            <span className="font-semibold text-lg">TinyLink</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-white" />
            <h1 className="text-5xl font-bold">TinyLink</h1>
          </div>
          <p className="text-xl text-zinc-400 max-w-2xl">
            Shorten URLs with style. Fast, reliable, and beautifully simple.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Create Link */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Create Short Link</h2>
          <CreateLinkForm />
        </section>

        {/* Links List */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Your Links</h2>
          <Suspense fallback={<LinksListSkeleton />}>
            <LinksList />
          </Suspense>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-24">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-zinc-500">
          Built with Next.js, Prisma, and Tailwind CSS
        </div>
      </footer>
    </div>
  )
}

function LinksListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((i) => (
        <div
          key={i}
          className="h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl animate-pulse"
        />
      ))}
    </div>
  )
}