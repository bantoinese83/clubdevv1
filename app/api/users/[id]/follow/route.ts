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
    const { id: targetUserId } = params
    const currentUserId = session.user.id

    if (targetUserId === currentUserId) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUserId },
      data: {
        following: {
          connect: { id: targetUserId },
        },
      },
      include: {
        following: true,
        followers: true,
      },
    })

    return NextResponse.json(
      {
        following: updatedUser.following.length,
        followers: updatedUser.followers.length,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error following user:", error)
    return NextResponse.json({ error: "Failed to follow user" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id: targetUserId } = params
    const currentUserId = session.user.id

    const updatedUser = await prisma.user.update({
      where: { id: currentUserId },
      data: {
        following: {
          disconnect: { id: targetUserId },
        },
      },
      include: {
        following: true,
        followers: true,
      },
    })

    return NextResponse.json(
      {
        following: updatedUser.following.length,
        followers: updatedUser.followers.length,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error unfollowing user:", error)
    return NextResponse.json({ error: "Failed to unfollow user" }, { status: 500 })
  }
}

