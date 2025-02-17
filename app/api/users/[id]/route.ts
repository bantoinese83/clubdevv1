import {NextResponse} from "next/server"
import {PrismaClient} from "@prisma/client"
import {getServerSession} from "next-auth/next"
import {authOptions} from "@/app/auth"
import {z} from "zod"

const prisma = new PrismaClient()

const updateProfileSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    bio: z.string().max(500).optional(),
    location: z.string().max(100).optional(),
    website: z.string().url().optional().nullable(),
    githubProfile: z.string().max(100).optional().nullable(),
    skills: z.array(z.string()).optional(),
})

interface ExtendedSession {
    user: {
        id: string
        name?: string | null
        email?: string | null
        image?: string | null
    }
}

export async function PUT(req: Request, {params}: { params: { id: string } }) {
    const session = await getServerSession(authOptions) as ExtendedSession
    if (!session || !session.user || session.user.id !== params.id) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        const body = await req.json()
        const validatedData = updateProfileSchema.parse(body)

        const updatedUser = await prisma.user.update({
            where: {id: params.id},
            data: validatedData,
        })

        return NextResponse.json(updatedUser, {status: 200})
    } catch (error) {
        console.error("Error updating user profile:", error)
        return NextResponse.json({error: "Failed to update profile"}, {status: 500})
    }
}

export async function GET(req: Request, {params}: { params: { id: string } }) {
    try {
        const user = await prisma.user.findUnique({
            where: {id: params.id},
            include: {
                badges: true,
                snippets: {
                    orderBy: {createdAt: "desc"},
                    take: 5,
                    include: {
                        likes: true,
                    },
                },
                followers: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                following: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        })

        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404})
        }

        return NextResponse.json(user, {status: 200})
    } catch (error) {
        console.error("Error fetching user profile:", error)
        return NextResponse.json({error: "Failed to fetch profile"}, {status: 500})
    }
}