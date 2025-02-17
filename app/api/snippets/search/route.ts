import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"

const prisma = new PrismaClient()

const searchParamsSchema = z.object({
  query: z.string().optional(),
  language: z.string().optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  sortBy: z.enum(["recent", "popular", "comments"]).optional().default("recent"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().optional().default(10),
  minLikes: z.coerce.number().int().nonnegative().optional(),
  maxLikes: z.coerce.number().int().nonnegative().optional(),
  createdAfter: z.string().datetime().optional(),
  createdBefore: z.string().datetime().optional(),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const params = Object.fromEntries(searchParams.entries())

  try {
    const {
      query,
      language,
      tags,
      author,
      sortBy,
      order,
      page,
      perPage,
      minLikes,
      maxLikes,
      createdAfter,
      createdBefore,
    } = searchParamsSchema.parse({
      ...params,
      tags: params.tags ? JSON.parse(params.tags) : undefined,
    })

    const where: any = {}

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { scripts: { some: { code: { contains: query, mode: "insensitive" } } } },
      ]
    }

    if (language) {
      where.scripts = {
        some: {
          language: { equals: language, mode: "insensitive" },
        },
      }
    }

    if (tags && tags.length > 0) {
      where.tags = { hasEvery: tags }
    }

    if (author) {
      where.user = { name: { contains: author, mode: "insensitive" } }
    }

    if (minLikes !== undefined || maxLikes !== undefined) {
      where.likes = {}
      if (minLikes !== undefined) {
        where.likes.gte = minLikes
      }
      if (maxLikes !== undefined) {
        where.likes.lte = maxLikes
      }
    }

    if (createdAfter) {
      where.createdAt = { ...where.createdAt, gte: new Date(createdAfter) }
    }

    if (createdBefore) {
      where.createdAt = { ...where.createdAt, lte: new Date(createdBefore) }
    }

    const orderBy: any = {}
    if (sortBy === "recent") {
      orderBy.createdAt = order
    } else if (sortBy === "popular") {
      orderBy.likes = { _count: order }
    } else if (sortBy === "comments") {
      orderBy.comments = { _count: order }
    }

    const snippets = await prisma.snippet.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        user: {
          select: {
            name: true,
          },
        },
        scripts: {
          select: {
            id: true,
            filename: true,
            language: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    const totalCount = await prisma.snippet.count({ where })

    return NextResponse.json({
      snippets: snippets.map((snippet) => ({
        ...snippet,
        author: snippet.user.name,
        likesCount: snippet._count.likes,
        commentsCount: snippet._count.comments,
      })),
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / perPage),
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Invalid search parameters" }, { status: 400 })
  }
}

