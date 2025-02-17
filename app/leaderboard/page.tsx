"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Spinner } from "../components/Spinner"
import { Badge } from "../components/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import type { Badge as BadgeType } from "@/app/types"

interface LeaderboardResponse {
    users: Array<{
        id: string
        name: string
        points: number
        snippetsCount: number
        likesCount: number
        badges: BadgeType[]
    }>
    totalPages: number
    currentPage: number
}

interface LeaderboardQueryParams {
    timeFrame: string
    sortBy: string
    page: number
}

async function fetchLeaderboard({ timeFrame, sortBy, page }: LeaderboardQueryParams) {
    const res = await fetch(`/api/leaderboard?timeFrame=${timeFrame}&sortBy=${sortBy}&page=${page}`)
    if (!res.ok) {
        throw new Error("Failed to fetch leaderboard")
    }
    return await res.json() as Promise<LeaderboardResponse>
}

export default function LeaderboardPage() {
    const [timeFrame, setTimeFrame] = useState("all")
    const [sortBy, setSortBy] = useState("points")
    const [page, setPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")

    const {
        data: leaderboard,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["leaderboard", { timeFrame, sortBy, page }],
        queryFn: () => fetchLeaderboard({ timeFrame, sortBy, page }),
        placeholderData: (previousData) => previousData,
        staleTime: 5000,
    })

    if (isLoading) return <Spinner />
    if (error) return <div>Error loading leaderboard</div>
    if (!leaderboard) return null

    const filteredUsers = leaderboard.users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
            <div className="mb-4 flex flex-wrap gap-4">
                <Select value={timeFrame} onValueChange={setTimeFrame}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time frame" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="points">Points</SelectItem>
                        <SelectItem value="snippets">Snippets</SelectItem>
                        <SelectItem value="likes">Likes</SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-auto"
                />
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {sortBy === "points" ? "Points" : sortBy === "snippets" ? "Snippets" : "Likes"}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badges</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {filteredUsers.map((user, index) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                <Link href={`/profile/${user.name}`} className="hover:underline">
                                    {user.name}
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {sortBy === "points" ? user.points : sortBy === "snippets" ? user.snippetsCount : user.likesCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                <div className="flex space-x-2">
                                    {user.badges.map((badge) => (
                                        <Badge key={badge.id} badge={badge} />
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} variant="outline">
                    Previous
                </Button>
                <span>
          Page {page} of {leaderboard.totalPages}
        </span>
                <Button
                    onClick={() => setPage((p) => Math.min(leaderboard.totalPages, p + 1))}
                    disabled={page === leaderboard.totalPages}
                    variant="outline"
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

