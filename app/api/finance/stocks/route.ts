import { NextResponse } from 'next/server'
import { getStocksWithHistory } from '@/lib/db/queries/finance'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') ?? '30', 10)

    const stocks = await getStocksWithHistory(days)
    return NextResponse.json({ stocks })
  } catch (err) {
    console.error('[finance/stocks] Error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
