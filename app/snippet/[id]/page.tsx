import { notFound } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { CodeSnippet } from "@/app/components/CodeSnippet"
import { SEO } from "@/app/components/SEO"
import { CodeSnippetStructuredData } from "@/app/components/StructuredData"

const prisma = new PrismaClient()

async function getSnippet(id: string) {
  const snippet = await prisma.snippet.findUnique({
    where: { id },
    include: {
      user: {
        select: { name: true, email: true },
      },
      likes: true,
    },
  })

  if (!snippet) {
    return null
  }

  return {
    ...snippet,
    author_name: snippet.user.name,
    likes: snippet.likes.length,
  }
}

export async function generateStaticParams() {
  const snippets = await prisma.snippet.findMany({
    select: { id: true },
    take: 100, // Adjust this number based on your needs
  })

  return snippets.map((snippet) => ({
    id: snippet.id,
  }))
}

export default async function SnippetPage({ params }: { params: { id: string } }) {
  const snippet = await getSnippet(params.id)

  if (!snippet) {
    notFound()
  }

  return (
    <>
      <SEO
        title={snippet.title}
        description={`${snippet.language} code snippet by ${snippet.author_name}`}
        type="article"
        date={snippet.createdAt.toISOString()}
      />
      <CodeSnippetStructuredData
        name={snippet.title}
        description={`${snippet.language} code snippet by ${snippet.author_name}`}
        author={snippet.author_name}
        datePublished={snippet.createdAt.toISOString()}
        programmingLanguage={snippet.language}
        codeRepositoryUrl={`https://clubdev.com/snippet/${snippet.id}`}
      />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{snippet.title}</h1>
        <p className="text-gray-600 mb-4">
          By {snippet.author_name} | Language: {snippet.language}
        </p>
        <CodeSnippet snippet={snippet} />
      </div>
    </>
  )
}

export const revalidate = 3600 // Revalidate every hour

