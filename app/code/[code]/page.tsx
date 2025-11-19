import { LinkStats } from '@/components/LinkStats'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function StatsPage(context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params
  if (!code) {
    return null
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/links/${code}`, {
    cache: 'no-store'
  })

  // console.log(res);
  
  
  if (!res.ok) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Link not found</h1>
          <Link href="/">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const link = await res.json()
  console.log(link);
  

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with Back Button */}
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <LinkStats link={link} />
      </main>
    </div>
  )
}