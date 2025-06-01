import Hero from "@/components/hero"
import Timeline from "@/components/timeline"
import PortfolioGrid from "@/components/portfolio-grid"
import CustomCursor from "@/components/custom-cursor"
import Footer from "@/components/footer"
import StickyThoughtsButton from "@/components/sticky-thoughts-button"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <CustomCursor />
      <StickyThoughtsButton />
      <Hero />
      <Timeline />
      <PortfolioGrid />
      <Footer />
    </main>
  )
}

