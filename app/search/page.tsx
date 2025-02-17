"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { CodeSnippet } from "../components/CodeSnippet"
import { Spinner } from "../components/Spinner"
import { DatePicker } from "../components/DatePicker"
import { SEO } from "../components/SEO"
import { ErrorMessage } from "../components/ErrorMessage"
import { toast } from "react-hot-toast"
import { Button } from "../components/ui/Button"
import type React from "react"
import { useAnalytics } from "@/app/hooks/useAnalytics"

const languages = ["JavaScript", "Python", "Java", "C++", "Ruby", "Go", "Rust", "TypeScript"]
const tags = ["React", "Node.js", "API", "Database", "Frontend", "Backend"]

async function searchSnippets(params: URLSearchParams) {
    const response = await fetch(`/api/snippets/search?${params.toString()}`)
    if (!response.ok) {
        throw new Error("Failed to fetch snippets")
    }
    return response.json()
}

export default function SearchPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState(searchParams.get("query") || "")
    const [language, setLanguage] = useState(searchParams.get("language") || "")
    const [selectedTags, setSelectedTags] = useState<string[]>(JSON.parse(searchParams.get("tags") || "[]"))
    const [author, setAuthor] = useState(searchParams.get("author") || "")
    const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "recent")
    const [order, setOrder] = useState(searchParams.get("order") || "desc")
    const [page, setPage] = useState(Number(searchParams.get("page") || "1"))
    const [minLikes, setMinLikes] = useState(searchParams.get("minLikes") || "")
    const [maxLikes, setMaxLikes] = useState(searchParams.get("maxLikes") || "")
    const [createdAfter, setCreatedAfter] = useState(searchParams.get("createdAfter") || "")
    const [createdBefore, setCreatedBefore] = useState(searchParams.get("createdBefore") || "")

    const { trackEvent } = useAnalytics()

    const { data, isLoading, error } = useQuery({
        queryKey: [
            "snippets",
            query,
            language,
            selectedTags,
            author,
            sortBy,
            order,
            page,
            minLikes,
            maxLikes,
            createdAfter,
            createdBefore,
        ],
        queryFn: () => {
            const params = new URLSearchParams({
                query,
                language,
                tags: JSON.stringify(selectedTags),
                author,
                sortBy,
                order,
                page: page.toString(),
                ...(minLikes && { minLikes }),
                ...(maxLikes && { maxLikes }),
                ...(createdAfter && { createdAfter }),
                ...(createdBefore && { createdBefore }),
            })
            return searchSnippets(params)
        },
        keepPreviousData: true,
        onError: (error) => {
            console.error("Search error:", error)
            toast.error("Failed to fetch search results. Please try again.")
        },
        onSuccess: (data) => {
            trackEvent("search_performed", {
                query,
                language,
                tags: selectedTags.join(","),
                author,
                sortBy,
                order,
                results_count: data.snippets.length.toString(),
            })
        },
    })

    useEffect(() => {
        const params = new URLSearchParams()
        if (query) params.set("query", query)
        if (language) params.set("language", language)
        if (selectedTags.length > 0) params.set("tags", JSON.stringify(selectedTags))
        if (author) params.set("author", author)
        params.set("sortBy", sortBy)
        params.set("order", order)
        params.set("page", page.toString())
        if (minLikes) params.set("minLikes", minLikes)
        if (maxLikes) params.set("maxLikes", maxLikes)
        if (createdAfter) params.set("createdAfter", createdAfter)
        if (createdBefore) params.set("createdBefore", createdBefore)
        router.push(`/search?${params.toString()}`)
    }, [
        query,
        language,
        selectedTags,
        author,
        sortBy,
        order,
        page,
        minLikes,
        maxLikes,
        createdAfter,
        createdBefore,
        router,
    ])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
    }

    const handleTagChange = (tag: string) => {
        setSelectedTags((prevTags) => (prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]))
        setPage(1)
    }

    return (
        <>
            <SEO title="Search Code Snippets" description="Find and discover code snippets from the ClubDev community" />
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Search Code Snippets</h1>
                <form onSubmit={handleSearch} className="space-y-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search snippets..."
                        className="w-full p-2 border rounded"
                    />
                    <div className="flex flex-wrap gap-4">
                        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="p-2 border rounded">
                            <option value="">All Languages</option>
                            {languages.map((lang) => (
                                <option key={lang} value={lang}>
                                    {lang}
                                </option>
                            ))}
                        </select>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border rounded">
                            <option value="recent">Most Recent</option>
                            <option value="popular">Most Popular</option>
                            <option value="comments">Most Comments</option>
                        </select>
                        <select value={order} onChange={(e) => setOrder(e.target.value)} className="p-2 border rounded">
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <p className="font-semibold">Tags:</p>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <label key={tag} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedTags.includes(tag)}
                                        onChange={() => handleTagChange(tag)}
                                        className="form-checkbox"
                                    />
                                    <span>{tag}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Author name"
                            className="p-2 border rounded"
                        />
                        <input
                            type="number"
                            value={minLikes}
                            onChange={(e) => setMinLikes(e.target.value)}
                            placeholder="Min likes"
                            className="p-2 border rounded"
                        />
                        <input
                            type="number"
                            value={maxLikes}
                            onChange={(e) => setMaxLikes(e.target.value)}
                            placeholder="Max likes"
                            className="p-2 border rounded"
                        />
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <DatePicker
                            selected={createdAfter ? new Date(createdAfter) : null}
                            onChange={(date) => setCreatedAfter(date ? date.toISOString() : "")}
                            placeholderText="Created after"
                            className="p-2 border rounded"
                        />
                        <DatePicker
                            selected={createdBefore ? new Date(createdBefore) : null}
                            onChange={(date) => setCreatedBefore(date ? date.toISOString() : "")}
                            placeholderText="Created before"
                            className="p-2 border rounded"
                        />
                    </div>
                    <Button type="submit">Search</Button>
                </form>
                {isLoading ? (
                    <Spinner />
                ) : error ? (
                    <ErrorMessage message="Failed to load search results. Please try again later." />
                ) : (
                    <div className="space-y-6">
                        {data.snippets.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">No results found. Try adjusting your search criteria.</p>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {data.snippets.map((snippet: any) => (
                                    <CodeSnippet key={snippet.id} snippet={snippet} />
                                ))}
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} variant="outline">
                                Previous
                            </Button>
                            <span>
                                Page {data.currentPage} of {data.totalPages}
                            </span>
                            <Button
                                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                                disabled={page === data.totalPages}
                                variant="outline"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}