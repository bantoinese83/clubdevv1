import {NextResponse} from "next/server"
import { Session } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}
import {z} from "zod"
import {PrismaClient} from "@prisma/client"
import {apiErrorHandler} from "@/app/utils/apiErrorHandler"
import {withAuth} from "@/app/middleware/withAuth"
import {getServerSession} from "next-auth"
import {authOptions} from "@/app/api/auth/[...nextauth]/route"
import {config} from "@/lib/config"
import {trackServerEvent} from "@/lib/analytics"

const prisma = new PrismaClient()

const scriptSchema = z.object({
    filename: z.string().min(1).max(100),
    language: z.string().min(1).max(50),
    code: z.string().min(1).max(config.maxUploadSize),
})

const snippetSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    scripts: z.array(scriptSchema).min(1),
    tags: z.array(z.string()).optional(),
})

export const POST = withAuth(async (req: Request & { session?: Session }) => {
    try {
        const body = await req.json()
        const {title, description, scripts, tags} = snippetSchema.parse(body)
        const session = await getServerSession(authOptions)

        if (!session || !session.user || !session.user.id) {
            throw new Error("User not authenticated")
        }

        const snippet = await prisma.snippet.create({
            data: {
                title,
                description,
                userId: session.user.id,
                tags: tags || [],
                scripts: {
                    create: scripts,
                },
            },
            include: {
                scripts: true,
            },
        })

        // Track snippet creation
        await trackServerEvent("snippet_created", {
            languages: scripts.map((s) => s.language).join(","),
            script_count: scripts.length.toString(),
            tags: tags?.join(",") || "",
        })

        return NextResponse.json(snippet, {status: 201})
    } catch (error) {
        return apiErrorHandler(error)
    }
})

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    try {
        const snippets = await prisma.snippet.findMany({
            take: limit,
            skip: (page - 1) * limit,
            orderBy: {createdAt: "desc"},
            include: {
                user: {
                    select: {name: true},
                },
                scripts: {
                    select: {filename: true, language: true},
                },
                likes: true,
            },
        })

        const total = await prisma.snippet.count()

        const result = {
            snippets: snippets.map((snippet) => ({
                ...snippet,
                author_name: snippet.user.name,
                likes: snippet.likes.length,
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        }

        // Track snippet listing
        await trackServerEvent("snippets_listed", {page: page.toString(), limit: limit.toString()})

        return NextResponse.json(result)
    } catch (error) {
        return apiErrorHandler(error)
    }
}