import BlogPost from './BlogPost'
import { blogPosts } from '@/app/data/blogPosts'

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default function Page() {
  return <BlogPost />
} 