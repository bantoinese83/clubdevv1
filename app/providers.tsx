"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { useState, useEffect } from "react"
import { useUserPreferences } from "./stores/userPreferences"

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode
  session?: any
}) {
  const [queryClient] = useState(() => new QueryClient())
  const { theme } = useUserPreferences()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <ThemeProvider attribute="class" defaultTheme={theme} enableSystem>
          {children}
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}

