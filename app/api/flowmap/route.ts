import { NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import type { Topic } from '@/app/data/flowmapData'

const FLOWMAP_DATA_PATH = join(process.cwd(), 'public', 'static', 'flowmap-data.json')

export async function GET() {
  try {
    const fileContents = await readFile(FLOWMAP_DATA_PATH, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to read flowmap data:', error)
    return NextResponse.json(
      { error: 'Failed to read flowmap data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const topics: Topic[] = await request.json()

    // Basic validation
    if (!Array.isArray(topics)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected an array of topics.' },
        { status: 400 }
      )
    }

    // Validate topic structure
    const validateTopic = (topic: any): boolean => {
      if (!topic || typeof topic !== 'object') return false
      if (!topic.id || typeof topic.id !== 'string') return false
      if (!topic.title || typeof topic.title !== 'string') return false
      if (!topic.icon || typeof topic.icon !== 'string') return false
      if (topic.subtopics && !Array.isArray(topic.subtopics)) return false
      if (topic.subtopics) {
        return topic.subtopics.every((subtopic: any) => validateTopic(subtopic))
      }
      return true
    }

    const isValid = topics.every(validateTopic)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid topic structure. Each topic must have id, title, and icon.' },
        { status: 400 }
      )
    }

    // Write to file
    const jsonData = JSON.stringify(topics, null, 2)
    await writeFile(FLOWMAP_DATA_PATH, jsonData, 'utf8')

    return NextResponse.json(
      { success: true, message: 'Flowmap data saved successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to save flowmap data:', error)
    return NextResponse.json(
      { error: 'Failed to save flowmap data' },
      { status: 500 }
    )
  }
}

