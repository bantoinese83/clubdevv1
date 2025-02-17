import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/auth"

const prisma = new PrismaClient()

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id: snippetId } = params
    const userId = session.user.id

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_snippetId: {
          userId,
          snippetId,
        },
      },
    })

    if (existingLike) {
      return NextResponse.json({ error: "Already liked" }, { status: 400 })
    }

    await prisma.like.create({
      data: {
        userId,
        snippetId,
      },
    })

    const likeCount = await prisma.like.count({
      where: { snippetId },
    })

    // Update points for the snippet author
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: 2,
        },
      },
    })

    return NextResponse.json({ likes: likeCount }, { status: 200 })
  } catch (error) {
    console.error("Error liking snippet:", error)
    return NextResponse.json({ error: "Failed to like snippet" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id: snippetId } = params
    const userId = session.user.id

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_snippetId: {
          userId,
          snippetId,
        },
      },
    })

    if (!existingLike) {
      return NextResponse.json({ error: "Like not found" }, { status: 404 })
    }

    await prisma.like.delete({
      where: {
        userId_snippetId: {
          userId,
          snippetId,
        },
      },
    })

    const likeCount = await prisma.like.count({
      where: { snippetId },
    })

    // Update points for the snippet author
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          decrement: 2,
        },
      },
    })

    return NextResponse.json({ likes: likeCount }, { status: 200 })
  } catch (error) {
    console.error("Error unliking snippet:", error)
    return NextResponse.json({ error: "Failed to unlike snippet" }, { status: 500 })
  }
}

