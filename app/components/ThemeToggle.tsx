"use client"

import type React from "react"

import {useTheme} from "@/app/hooks/useTheme"
import {Sun, Moon, Monitor} from "lucide-react"
import {Button} from "./ui/Button"

const ThemeButton = ({theme, icon, onClick}: { theme: string; icon: React.ReactNode; onClick: () => void }) => (
    <Button
        variant={theme === "light" ? "default" : "outline"}
        size="default" // Changed from "icon" to "default"
        onClick={onClick}
        aria-label={`${theme} mode`}
    >
        {icon}
    </Button>
)

export function ThemeToggle() {
    const {theme, setTheme} = useTheme()

    return (
        <div className="flex space-x-2">
            <ThemeButton theme="light" icon={<Sun className="h-[1.2rem] w-[1.2rem]"/>}
                         onClick={() => setTheme("light")}/>
            <ThemeButton theme="dark" icon={<Moon className="h-[1.2rem] w-[1.2rem]"/>}
                         onClick={() => setTheme("dark")}/>
            <ThemeButton
                theme="system"
                icon={<Monitor className="h-[1.2rem] w-[1.2rem]"/>}
                onClick={() => setTheme("system")}
            />
        </div>
    )
}