"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"
import { useAuth } from "./useAuth"

export function useSnippet(initialLikes: number) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiking, setIsLiking] = useState(false)
  const { isAuthenticated } = useAuth()

  const handleLike = async (snippetId: string) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to like snippets.")
      return
    }

    setIsLiking(true)
    try {
      const response = await fetch(`/api/snippets/${snippetId}/like`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setLikes(data.likes)
        toast.success("Snippet liked!")
      } else {
        throw new Error("Failed to like snippet")
      }
    } catch (error) {
      console.error("Error liking snippet:", error)
      toast.error("Failed to like snippet. Please try again.")
    } finally {
      setIsLiking(false)
    }
  }

  return {
    likes,
    isLiking,
    handleLike,
  }
}

