import { getAllPages } from '@/lib/db/queries/knowledge'
import KnowledgeBasePage from './KnowledgeBasePage'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Knowledge Base | Harshat',
  description: 'Research notes and learning materials — exclusive to newsletter subscribers',
}

export default async function KnowledgePage() {
  let allPages: Awaited<ReturnType<typeof getAllPages>> = []
  try {
    allPages = await getAllPages()
  } catch (err) {
    console.error('[KnowledgePage] getAllPages failed:', err)
  }

  return <KnowledgeBasePage allPages={allPages} />
}
