import {NextResponse} from "next/server"
import {PrismaClient, Prisma} from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url)
    const timeFrame = searchParams.get("timeFrame") || "all"
    const sortBy = searchParams.get("sortBy") || "points"
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = 10

    try {
        let whereClause: Prisma.UserWhereInput = {}
        if (timeFrame === "month") {
            whereClause = {
                createdAt: {
                    gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                },
            }
        } else if (timeFrame === "week") {
            whereClause = {
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                },
            }
        }

        let orderBy: Prisma.UserOrderByWithRelationInput = {}
        if (sortBy === "points") {
            orderBy = {points: "desc"}
        } else if (sortBy === "snippets") {
            orderBy = {snippets: {_count: "desc"}}
        } else if (sortBy === "likes") {
            orderBy = {
                snippets: {
                    _count: "desc"
                }
            }
        }

        const users = await prisma.user.findMany({
            where: whereClause,
            orderBy: orderBy,
            take: limit,
            skip: (page - 1) * limit,
            include: {
                badges: true,
                snippets: {
                    include: {
                        likes: true,
                    },
                },
            },
        })

        const totalUsers = await prisma.user.count({where: whereClause})

        const formattedUsers = users.map((user) => ({
            id: user.id,
            name: user.name,
            points: user.points,
            snippetsCount: user.snippets.length,
            likesCount: user.snippets.reduce((acc, snippet) => acc + snippet.likes.length, 0),
            badges: user.badges,
        }))

        return NextResponse.json({
            users: formattedUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
        })
    } catch (error) {
        console.error("Error fetching leaderboard:", error)
        return NextResponse.json({error: "Failed to fetch leaderboard"}, {status: 500})
    }
}