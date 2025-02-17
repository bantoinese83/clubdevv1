"use client"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"

type Comment = {
  id: string
  content: string
  createdAt: string
  user: {
    name: string
    image: string
  }
}

type CommentListProps = {
  snippetId: string
}

async function fetchComments(snippetId: string): Promise<Comment[]> {
  const response = await fetch(`/api/snippets/${snippetId}/comment`)
  if (!response.ok) {
    throw new Error("Failed to fetch comments")
  }
  return response.json()
}

export function CommentList({ snippetId }: CommentListProps) {
  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comment[]>({
    queryKey: ["comments", snippetId],
    queryFn: () => fetchComments(snippetId),
  })

  if (isLoading) return <div>Loading comments...</div>
  if (error) return <div>Error loading comments</div>

  return (
    <div className="mt-4 space-y-4">
      {comments?.map((comment: Comment) => (
        <div key={comment.id} className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
          <div className="flex items-center mb-2">
            <Image
              src={comment.user.image || "/placeholder.svg"}
              alt={comment.user.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="font-semibold">{comment.user.name}</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
          <p className="text-sm text-gray-500 mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}