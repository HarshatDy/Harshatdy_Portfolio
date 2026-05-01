import { NextResponse } from 'next/server'
import { getIndiaStockDetail } from '@/lib/db/queries/indiaFinance'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: { ticker: string } },
) {
  try {
    const detail = await getIndiaStockDetail(params.ticker)
    if (!detail) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 })
    }
    return NextResponse.json({ stock: detail })
  } catch (err) {
    console.error(`[india/stock/${params.ticker}] GET error:`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
