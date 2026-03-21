import FinanceDashboard from "./FinanceDashboard"

export const metadata = {
  title: "Finance Dashboard | Harshat",
  description: "Personal stock watchlist with daily Claude AI analysis",
}

export default function FinancePage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-12 max-w-7xl mx-auto">
      <FinanceDashboard />
    </main>
  )
}
