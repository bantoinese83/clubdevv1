import { useTheme as useNextTheme } from "next-themes"
import { useUserPreferences } from "@/app/stores/userPreferences"

export function useTheme() {
  const { theme, setTheme } = useNextTheme()
  const { setTheme: setUserTheme } = useUserPreferences()

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    setUserTheme(newTheme)
  }

  return {
    theme,
    setTheme: handleThemeChange,
  }
}

