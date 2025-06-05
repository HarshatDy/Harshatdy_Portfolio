// Define the types for our blog post data
export interface ContentBlock {
  type: 'paragraph' | 'heading' | 'image' | 'code';
  content: string;
  url?: string;
  caption?: string;
  language?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  heroImage: string;
  excerpt: string;
  content: ContentBlock[];
}

export interface SliderBlogPost {
    slug: string
    title: string
    category: string
    date: string
    excerpt: string
    heroImage: string
    readTime: string
    tags: string[]
}

interface MongoDocument {
  _id: string;
  [key: string]: any;
}

function removeId<T extends { _id?: any }>(doc: T): Omit<T, '_id'> {
  const { _id, ...rest } = doc;
  return rest;
}

export const blogPosts: BlogPost[] = []
export const sliderblogPosts: SliderBlogPost[] = []

export async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    const response = await fetch('http://127.0.0.1:3001/api/blogs', {
      cache: 'no-store' // Disable caching
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Before Cleaning ', data);
    
    // Remove _id from each blog post while preserving all other fields
    const cleanedBlogs = data.documents.map((blog: MongoDocument) => {
      const { _id, ...rest } = blog;
      return rest as BlogPost;  // Type assertion to ensure correct type
    });
    
    console.log('After Cleaning', cleanedBlogs);
    return cleanedBlogs;
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
}

export async function fetchHeroblogs(): Promise<SliderBlogPost[]> {
  try {
    const response = await fetch('http://127.0.0.1:3001/api/hero_blogs', {
      cache: 'no-store' // Disable caching
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("About to call the blogs");
    const data = await response.json();
    console.log('Fetched hero_blogs:', data);
    
    // Remove _id from each blog post while preserving all other fields
    const cleanedBlogs = data.documents.map((blog: MongoDocument) => {
      const { _id, ...rest } = blog;
      return rest as SliderBlogPost;  // Type assertion to ensure correct type
    });
    
    console.log('After Cleaning', cleanedBlogs);
    return cleanedBlogs;
  } catch (error) {
    console.error('Failed to fetch hero_blogs:', error);
    return [];
  }
}

// Initialize blog data immediately
let isInitialized = false;

export async function initializeBlogData() {
  if (isInitialized) return;
  
  try {
    console.log('Initializing blog data...');
    // Fetch both blog types in parallel
    const [blogs, heroBlogs] = await Promise.all([
      fetchBlogs(),
      fetchHeroblogs()
    ]);

    // Clear existing data
    blogPosts.length = 0;
    sliderblogPosts.length = 0;

    // Assign the fetched data to our exported arrays
    blogPosts.push(...blogs);
    sliderblogPosts.push(...heroBlogs);

    console.log('Blog posts initialized:', blogPosts.length);
    console.log('Slider blog posts initialized:', sliderblogPosts.length);
    console.log('Slider blog Categories:', sliderblogPosts.map((post) => post.category));
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize blog data:', error);
  }
}

// Call initialization
initializeBlogData();

// console.log(hero_blogs)
// console.log(blogs)

// Sample blog data - in a real app, this would come from a database or CMS



