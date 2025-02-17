import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/auth"
import { z } from "zod"

const prisma = new PrismaClient()

const commentSchema = z.object({
  content: z.string().min(1).max(500),
})

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id: snippetId } = params
    const userId = session.user.id
    const body = await req.json()
    const { content } = commentSchema.parse(body)

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        snippetId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    // Update points for the comment author
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: 5,
        },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id: snippetId } = params

    const comments = await prisma.comment.findMany({
      where: { snippetId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(comments, { status: 200 })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

