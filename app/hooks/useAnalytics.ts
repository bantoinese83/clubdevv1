"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

declare global {
  interface Window {
    plausible: (eventName: string, options?: { props?: Record<string, string | number> }) => void
  }
}

export function useAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page views
    const url = pathname + searchParams.toString()
    if (typeof window.plausible === "function") {
      window.plausible("pageview", { props: { url } })
    }
  }, [pathname, searchParams])

  const trackEvent = (eventName: string, props?: Record<string, string | number>) => {
    if (typeof window.plausible === "function") {
      window.plausible(eventName, { props })
    }
  }

  return { trackEvent }
}