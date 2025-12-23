import Hero from "@/components/hero"
import Timeline from "@/components/timeline"
import PortfolioGrid from "@/components/portfolio-grid"
import CustomCursor from "@/components/custom-cursor"
import Footer from "@/components/footer"
import StickyThoughtsButton from "@/components/sticky-thoughts-button"
import LearnButton from "@/components/learn-button"
import Experience from "@/components/experience"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <CustomCursor />
      <StickyThoughtsButton />
      <LearnButton />
      <Hero />
      <Experience />
      <Timeline />
      <PortfolioGrid />
      <Footer />
    </main>
  )
}

