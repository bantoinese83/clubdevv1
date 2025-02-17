"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Label } from "@/components/ui/Label"
import { toast } from "react-hot-toast"

const updateProfileSchema = z.object({
  name: z.string().min(2).max(50),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().nullable(),
  githubProfile: z.string().max(100).optional().nullable(),
  skills: z.array(z.string()).optional(),
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

type EditProfileModalProps = {
  userId: string
  onClose: () => void
}

export function EditProfileModal({ userId, onClose }: EditProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  })

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch(`/api/users/${userId}`)
        if (response.ok) {
          const userData = await response.json()
          setValue("name", userData.name)
          setValue("bio", userData.bio)
          setValue("location", userData.location)
          setValue("website", userData.website)
          setValue("githubProfile", userData.githubProfile)
          setValue("skills", userData.skills)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        toast.error("Failed to load user profile")
      }
    }
    fetchUserProfile()
  }, [userId, setValue])

  const onSubmit = async (data: UpdateProfileData) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success("Profile updated successfully")
        onClose()
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" {...register("bio")} rows={3} />
            {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" {...register("website")} />
            {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>}
          </div>
          <div>
            <Label htmlFor="githubProfile">GitHub Profile</Label>
            <Input id="githubProfile" {...register("githubProfile")} />
            {errors.githubProfile && <p className="text-red-500 text-sm mt-1">{errors.githubProfile.message}</p>}
          </div>
          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              {...register("skills")}
              onChange={(e) =>
                setValue(
                  "skills",
                  e.target.value.split(",").map((skill) => skill.trim()),
                )
              }
            />
            {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

