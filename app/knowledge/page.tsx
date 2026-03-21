import { getAllPages } from '@/lib/db/queries/knowledge'
import KnowledgeBasePage from './KnowledgeBasePage'

export const metadata = {
  title: 'Knowledge Base | Harshat',
  description: 'Research notes and learning materials — exclusive to newsletter subscribers',
}

export default async function KnowledgePage() {
  // Fetch all pages server-side (no email auth needed for the flat list — content is gated separately)
  let allPages: Awaited<ReturnType<typeof getAllPages>> = []
  try {
    allPages = await getAllPages()
  } catch {
    // DB not configured yet — render gate screen with empty tree
  }

  return <KnowledgeBasePage allPages={allPages} />
}
