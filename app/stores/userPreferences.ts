import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark" | "system"

interface UserPreferences {
  theme: Theme
  fontSize: number
  setTheme: (theme: Theme) => void
  setFontSize: (size: number) => void
}

export const useUserPreferences = create<UserPreferences>()(
  persist(
    (set) => ({
      theme: "system",
      fontSize: 16,
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      name: "user-preferences",
    },
  ),
)

