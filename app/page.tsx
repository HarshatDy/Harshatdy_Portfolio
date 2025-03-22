import Hero from "@/components/hero"
import Timeline from "@/components/timeline"
import PortfolioGrid from "@/components/portfolio-grid"
import CustomCursor from "@/components/custom-cursor"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <CustomCursor />
      <Hero />
      <Timeline />
      <PortfolioGrid />
      <Footer />
    </main>
  )
}

