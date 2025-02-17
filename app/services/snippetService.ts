import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

export async function createSnippet(userId: string, title: string, code: string, language: string, tags: string[]) {
    return prisma.snippet.create({
        data: {
            title,
            tags: tags || [],
            userId,
        },
    });
}

export async function getSnippets(page: number, limit: number) {
    const snippets = await prisma.snippet.findMany({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {createdAt: "desc"},
        include: {
            user: {
                select: {name: true},
            },
            likes: true,
        },
    })

    const total = await prisma.snippet.count()

    return {
        snippets: snippets.map((snippet) => ({
            ...snippet,
            author_name: snippet.user.name,
            likes: snippet.likes.length,
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit),
    }
}