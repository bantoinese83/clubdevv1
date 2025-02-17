import type { Badge as BadgeType } from "../types"
import Image from "next/image"

type BadgeProps = {
  badge: BadgeType
}

export function Badge({ badge }: BadgeProps) {
  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-sm">
      <Image src={badge.imageUrl || "/placeholder.svg"} alt={badge.name} width={24} height={24} className="w-6 h-6" />
      <span className="text-sm font-medium">{badge.name}</span>
    </div>
  )
}