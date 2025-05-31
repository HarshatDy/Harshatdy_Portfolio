import BlogPost from './BlogPost'
import { BlogPost as BlogPostType } from '@/app/data/blogPosts'
import { fetchBlogs } from '@/app/data/blogPosts'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blogs = await fetchBlogs();
  const post = blogs.find((blog: BlogPostType) => blog.slug === params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  return {
    title: post.title,
    description: post.excerpt
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const blogs = await fetchBlogs();
  const post = blogs.find((blog: BlogPostType) => blog.slug === params.slug);

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Post not found</h1>
          <a
            href="/"
            className="mt-4 inline-block rounded-md bg-[#FF8000] px-4 py-2 text-white transition-colors hover:bg-[#FF8000]/80"
          >
            Return Home
          </a>
        </div>
      </div>
    )
  }

  return <BlogPost post={post} />
}
