import { notFound } from 'next/navigation'
import BlogPost from './BlogPost'
import { fetchBlogs } from '@/app/data/blogPosts'

export async function generateStaticParams() {
  const blogs = await fetchBlogs()
  return blogs.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Page({ params }: { params: { slug: string } }) {
  const blogs = await fetchBlogs()
  const post = blogs.find((post) => post.slug === params.slug)
  
  if (!post) {
    notFound()
  }
  
  return <BlogPost post={post} />
} 