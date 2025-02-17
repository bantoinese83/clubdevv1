"use client"

import type React from "react"

import { useState } from "react"
import { useComments } from "@/app/hooks/useComments"

type CommentFormProps = {
  snippetId: string
  onCommentAddedAction: () => void
}

export function CommentForm({ snippetId, onCommentAddedAction }: CommentFormProps) {
  const [content, setContent] = useState("")
  const { isSubmitting, addComment } = useComments(snippetId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await addComment(content)
    if (success) {
      setContent("")
      onCommentAddedAction()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="w-full p-2 border rounded-md resize-none"
        rows={3}
        required
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  )
}