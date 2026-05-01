import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import IndiaDashboard from './IndiaDashboard'

export const metadata: Metadata = {
  title: 'India Stocks | Harshat',
  description: 'Nifty 50 BUY/HOLD/SELL signals with Claude AI analysis, updated 3× daily',
}

export default function IndiaStocksPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-12 max-w-7xl mx-auto">
      <Link
        href="/finance"
        className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Finance
      </Link>
      <IndiaDashboard />
    </main>
  )
}
