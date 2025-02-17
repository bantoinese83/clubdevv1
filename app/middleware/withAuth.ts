import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/auth"

export function withAuth(handler: (req: Request) => Promise<NextResponse>) {
  return async (req: Request) => {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return handler(req)
  }
}

