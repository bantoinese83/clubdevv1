"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"
import { useAuth } from "./useAuth"

export function useComments(snippetId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isAuthenticated } = useAuth()

  const addComment = async (content: string) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to comment.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/snippets/${snippetId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        toast.success("Comment posted successfully!")
        return true
      } else {
        throw new Error("Failed to post comment")
      }
    } catch (error) {
      console.error("Error posting comment:", error)
      toast.error("Failed to post comment. Please try again.")
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    addComment,
  }
}

