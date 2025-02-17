import { headers } from "next/headers"

export async function trackServerEvent(eventName: string, props?: Record<string, string | number>) {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for") || "127.0.0.1"
  const userAgent = headersList.get("user-agent") || ""

  const domain = process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "")

  if (!domain) {
    console.error("NEXT_PUBLIC_SITE_URL is not set")
    return
  }

  const event = {
    name: eventName,
    domain,
    url: headersList.get("referer") || "/",
    ip,
    ua: userAgent,
    props,
  }

  try {
    await fetch("https://plausible.io/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": userAgent,
        "X-Forwarded-For": ip,
      },
      body: JSON.stringify(event),
    })
  } catch (error) {
    console.error("Error tracking server event:", error)
  }
}

