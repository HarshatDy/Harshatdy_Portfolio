import { NextResponse } from 'next/server'
import { getIndiaStocksWithSignals } from '@/lib/db/queries/indiaFinance'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const stocks = await getIndiaStocksWithSignals()
    return NextResponse.json({ stocks })
  } catch (err) {
    console.error('[india/stocks] GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
