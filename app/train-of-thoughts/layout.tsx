import type React from "react"
import type { Metadata } from "next"
// import { Inter } from "next/font/google"
import { Roboto_Mono } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import CustomCursor from "@/components/custom-cursor"

// const inter = Inter({ subsets: ["latin"] })
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" })

export const metadata: Metadata = {
  title: "Harshat Dy | Train of Thoughts",
  description: "Insights and articles on software engineering, 5G, web design, and more",
}

export default function TrainOfThoughtsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={robotoMono.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
