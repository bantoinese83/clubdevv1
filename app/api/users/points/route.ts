import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/auth"
import { z } from "zod"

const prisma = new PrismaClient()

const pointsSchema = z.object({
  action: z.enum(["share_snippet", "get_like", "get_comment"]),
})

const pointsValues = {
  share_snippet: 10,
  get_like: 2,
  get_comment: 5,
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { action } = pointsSchema.parse(body)

    const user = await prisma.user.update({
      where: { email: session.user.email ?? undefined },
      data: {
        points: {
          increment: pointsValues[action],
        },
      },
    })

    // Check for new badges
    await checkAndAwardBadges(user.id)

    return NextResponse.json({ points: user.points }, { status: 200 })
  } catch (error) {
    console.error("Error updating points:", error)
    return NextResponse.json({ error: "Failed to update points" }, { status: 500 })
  }
}

async function checkAndAwardBadges(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { badges: true, snippets: true },
  })

  if (!user) return

  const badgesToAward = []

  // Check for points-based badges
  if (user.points >= 100 && !user.badges.some((b) => b.name === "Century")) {
    badgesToAward.push("Century")
  }
  if (user.points >= 1000 && !user.badges.some((b) => b.name === "Millennium")) {
    badgesToAward.push("Millennium")
  }

  // Check for snippet-based badges
  if (user.snippets.length >= 5 && !user.badges.some((b) => b.name === "Coder")) {
    badgesToAward.push("Coder")
  }
  if (user.snippets.length >= 20 && !user.badges.some((b) => b.name === "Prolific")) {
    badgesToAward.push("Prolific")
  }

  // Award new badges
  for (const badgeName of badgesToAward) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        badges: {
          connect: {
            name: badgeName,
          },
        },
      },
    })
  }
}

