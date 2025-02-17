import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/auth"
import { z } from "zod"

const prisma = new PrismaClient()

const updateSnippetSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  language: z.string().min(1).max(50).optional(),
  tags: z.array(z.string()).optional(),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const snippet = await prisma.snippet.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { name: true },
        },
        likes: true,
        comments: {
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...snippet,
      author_name: snippet.user.name,
      likes: snippet.likes.length,
    })
  } catch (error) {
    console.error("Error fetching snippet:", error)
    return NextResponse.json({ error: "Failed to fetch snippet" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, language, tags } = updateSnippetSchema.parse(body)

    const snippet = await prisma.snippet.findUnique({
      where: { id: params.id },
      select: { userId: true },
    })

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    if (snippet.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updatedSnippet = await prisma.snippet.update({
      where: { id: params.id },
      data: { title, language, tags },
    })

    return NextResponse.json(updatedSnippet)
  } catch (error) {
    console.error("Error updating snippet:", error)
    return NextResponse.json({ error: "Failed to update snippet" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const snippet = await prisma.snippet.findUnique({
      where: { id: params.id },
      select: { userId: true },
    })

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    if (snippet.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await prisma.snippet.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Snippet deleted successfully" })
  } catch (error) {
    console.error("Error deleting snippet:", error)
    return NextResponse.json({ error: "Failed to delete snippet" }, { status: 500 })
  }
}

