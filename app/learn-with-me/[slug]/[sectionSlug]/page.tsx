import { notFound } from 'next/navigation'
import SectionPage from './SectionPage'
import { loadFlowmapData } from '@/app/data/flowmapData'
import type { Topic, Section } from '@/app/data/flowmapData'

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
    const params: { slug: string; sectionSlug: string }[] = []
    
    const collectSectionParams = (topics: Topic[]) => {
      topics.forEach(topic => {
        if (topic.slug && topic.sections) {
          topic.sections.forEach(section => {
            if (section.slug) {
              params.push({ slug: topic.slug!, sectionSlug: section.slug })
            }
          })
        }
        if (topic.subtopics) {
          collectSectionParams(topic.subtopics)
        }
      })
    }
    
    collectSectionParams(topics)
    return params
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return []
  }
}

export default async function Page({ 
  params 
}: { 
  params: { slug: string; sectionSlug: string } 
}) {
  const topics = await loadFlowmapData()
  const topic = findTopicBySlug(topics, params.slug)
  
  if (!topic) {
    notFound()
  }

  const section = topic.sections?.find(s => s.slug === params.sectionSlug)
  
  if (!section) {
    notFound()
  }
  
  return <SectionPage topic={topic} section={section} allTopics={topics} />
}

