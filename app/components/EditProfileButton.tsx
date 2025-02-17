"use client"

import { useState } from "react"
import { EditProfileModal } from "./EditProfileModal"

type EditProfileButtonProps = {
  userId: string
}

export function EditProfileButton({ userId }: EditProfileButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Edit Profile
      </button>
      {isModalOpen && <EditProfileModal userId={userId} onClose={() => setIsModalOpen(false)} />}
    </>
  )
}

