import { notFound } from 'next/navigation'
import FlowNodePage from './FlowNodePage'
import { loadFlowmapData } from '@/app/data/flowmapData'
import type { Topic } from '@/app/data/flowmapData'

// Find topic by slug recursively
function findTopicBySlug(topics: Topic[], slug: string): Topic | null {
  for (const topic of topics) {
    if (topic.slug === slug) {
      return topic
    }
    if (topic.subtopics && topic.subtopics.length > 0) {
      const found = findTopicBySlug(topic.subtopics, slug)
      if (found) return found
    }
  }
  return null
}

export async function generateStaticParams() {
  try {
    const topics = await loadFlowmapData()
    const slugs: string[] = []
    
    const collectSlugs = (topics: Topic[]) => {
      topics.forEach(topic => {
        if (topic.slug) {
          slugs.push(topic.slug)
        }
        if (topic.subtopics) {
          collectSlugs(topic.subtopics)
        }
      })
    }
    
    collectSlugs(topics)
    return slugs.map((slug) => ({ slug }))
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return []
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const topics = await loadFlowmapData()
  const topic = findTopicBySlug(topics, params.slug)
  
  if (!topic) {
    notFound()
  }
  
  return <FlowNodePage topic={topic} allTopics={topics} />
}

