import type { Metadata } from 'next'
import PlaybookShell from '@/components/finance/playbook/PlaybookShell'

export const metadata: Metadata = {
  title: 'NSE 100 Swing Trading Playbook | Harshat',
  description: 'Complete swing trading framework for NSE 100 stocks — indicators, algorithms, risk management, and weekly playbook',
}

export default function PlaybookPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-12 max-w-7xl mx-auto">
      <PlaybookShell />
    </main>
  )
}
