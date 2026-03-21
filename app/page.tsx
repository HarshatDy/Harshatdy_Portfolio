import Hero from "@/components/hero"
import Timeline from "@/components/timeline"
import PortfolioGrid from "@/components/portfolio-grid"
import Footer from "@/components/footer"
import StickyThoughtsButton from "@/components/sticky-thoughts-button"

import NavLinks from "@/components/nav-links"
import Experience from "@/components/experience"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <StickyThoughtsButton />
      <NavLinks />
      <Hero />
      <Timeline />
      <PortfolioGrid />
      <Footer />
    </main>
  )
}

