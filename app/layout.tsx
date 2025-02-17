import type React from "react"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import { Navbar } from "./components/Navbar"
import { Footer } from "./components/Footer"
import { Breadcrumbs } from "./components/Breadcrumbs"
import { authOptions } from "./api/auth/[...nextauth]/route"
import "./globals.css"

import { getServerSession } from "next-auth/next"
import { Toaster } from "react-hot-toast"
import { config } from "@/lib/config"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: `${config.siteName} - Code Sharing Platform`,
  description: `Share, discover, and learn from code snippets in the ${config.siteName} community`,
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <head>
        <Script
          defer
          data-domain={config.siteUrl.replace(/^https?:\/\//, "")}
          src="https://plausible.io/js/script.js"
        /><title>
            {metadata.title}
      </title>
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900`}>
        <Providers session={session}>
          <Navbar />
          <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumbs />
            <main className="mt-4">{children}</main>
          </div>
          <Footer />
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}



import './globals.css'