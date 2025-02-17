"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"

type FollowButtonProps = {
  userId: string
  initialIsFollowing: boolean
}

export function FollowButton({ userId, initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const handleFollow = async () => {
    if (!session) {
      toast.error("You must be logged in to follow users.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
      })

      if (response.ok) {
        setIsFollowing(!isFollowing)
        toast.success(isFollowing ? "Unfollowed successfully" : "Followed successfully")
      } else {
        throw new Error("Failed to update follow status")
      }
    } catch (error) {
      console.error("Error updating follow status:", error)
      toast.error("Failed to update follow status. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`px-4 py-2 rounded-md ${
        isFollowing ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-indigo-600 text-white hover:bg-indigo-700"
      } disabled:opacity-50`}
    >
      {isLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  )
}

