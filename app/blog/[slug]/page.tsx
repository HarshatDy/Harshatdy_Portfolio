import BlogPost from './BlogPost'

export async function generateStaticParams() {
  return [
    { slug: 'network-dashboard' },
    { slug: 'mobile-app-ui' },
    { slug: '5g-implementation' },
    { slug: 'e-commerce-platform' },
    { slug: 'iot-control-system' },
    { slug: 'analytics-dashboard' }
  ]
}

export default function Page() {
  return <BlogPost />
}
