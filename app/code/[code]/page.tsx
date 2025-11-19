import { LinkStats } from '@/components/LinkStats'

export default async function StatsPage(context: { params: Promise <{ code: string }> }) {
  const {code} = await context.params
  if(!code) {
    return;
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/links/${code}`)
  if (!res.ok) return <div className="text-center text-red-500 mt-10">Link not found</div>

  const link = await res.json()
  console.log("==========",link);
  

  return <LinkStats link={link} />
}
