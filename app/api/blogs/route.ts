import { NextResponse } from 'next/server'
import { fetchBlogs, fetchHeroblogs } from '@/app/data/blogPosts'

export async function GET() {
  try {
    const [blogs, heroBlogs] = await Promise.all([
      fetchBlogs(),
      fetchHeroblogs()
    ])
    
    return NextResponse.json({ blogs, heroBlogs })
  } catch (error) {
    console.error('Failed to fetch blogs:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
} 