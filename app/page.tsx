import Link from "next/link"
import { CodeSnippetList } from "./components/CodeSnippetList"
import { SEO } from "./components/SEO"
import { WebsiteStructuredData } from "./components/StructuredData"
import { PrismaClient } from "@prisma/client"
import { trackServerEvent } from "@/lib/analytics"

const prisma = new PrismaClient()

async function getRecentSnippets() {
    const snippets = await prisma.snippet.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { name: true },
            },
            likes: true,
            scripts: true, // Include scripts
        },
    })

    return snippets.map((snippet) => ({
        ...snippet,
        author_name: snippet.user.name,
        likes: snippet.likes.length,
        language: snippet.scripts[0]?.language, // Map language from the first script
    }))
}

export default async function Home() {
    const recentSnippets = await getRecentSnippets()

    // Track homepage visit
    await trackServerEvent("homepage_visited")

    return (
        <>
            <SEO
                title="Welcome to ClubDev"
                description="Share, discover, and learn from code snippets in our community"
                image="https://clubdev.com/og-image.jpg"
            />
            <WebsiteStructuredData name="ClubDev" alternateName="Club for Developers" url="https://clubdev.com" />
            <div className="space-y-8">
                <section className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Welcome to ClubDev</h1>
                    <p className="text-xl mb-6">Share, discover, and learn from code snippets in our community</p>
                    <Link href="/search" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                        Explore Snippets
                    </Link>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Recent Snippets</h2>
                    <CodeSnippetList snippets={recentSnippets} />
                </section>
            </div>
        </>
    )
}