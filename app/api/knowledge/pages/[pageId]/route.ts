import { NextResponse } from 'next/server'
import { getPageContent, isVerifiedSubscriber } from '@/lib/db/queries/knowledge'

export async function GET(
  request: Request,
  { params }: { params: { pageId: string } },
) {
  // Gate: validate X-KB-Email header
  const email = request.headers.get('X-KB-Email')?.trim().toLowerCase() ?? ''
  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const hasAccess = await isVerifiedSubscriber(email)
  if (!hasAccess) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const content = await getPageContent(params.pageId)
    if (!content) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }
    return NextResponse.json(content)
  } catch (err) {
    console.error('[knowledge/pages]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 },
    )
  }
}
