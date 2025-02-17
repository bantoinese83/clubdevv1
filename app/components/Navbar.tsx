"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Home, Search, Trophy, PlusCircle, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "./ui/Button"
import { ThemeToggle } from "./ThemeToggle"
import { useAuth } from "@/app/hooks/useAuth"

const NavItem = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
        isActive
          ? "text-white bg-indigo-600 dark:bg-indigo-500"
          : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Link>
  )
}

const NavItems = ({ items }: { items: Array<{ href: string; label: string; icon: React.ElementType }> }) => (
  <div className="hidden md:flex items-center space-x-4">
    {items.map((item) => (
      <NavItem key={item.href} {...item} />
    ))}
  </div>
)

const MobileMenu = ({
  isOpen,
  items,
  onClose,
}: {
  isOpen: boolean
  items: Array<{ href: string; label: string; icon: React.ElementType }>
  onClose: () => void
}) => {
  if (!isOpen) return null

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {items.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </div>
    </div>
  )
}

const AuthButtons = () => {
  const { session, status, logout } = useAuth()

  if (status === "loading") {
    return <div className="text-gray-600 dark:text-gray-300">Loading...</div>
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <Button href={`/profile/${session.user?.name}`} variant="ghost">
          <User className="w-5 h-5 mr-2" />
          Profile
        </Button>
        <Button onClick={logout} variant="ghost">
          Sign out
        </Button>
      </div>
    )
  }

  return (
    <>
      <Button href="/login" variant="ghost">
        Log in
      </Button>
      <Button href="/signup">Sign up</Button>
    </>
  )
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/share", label: "Share Code", icon: PlusCircle },
  ]

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">ClubDev</span>
            </Link>
            <NavItems items={navItems} />
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <AuthButtons />
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      <MobileMenu isOpen={isMenuOpen} items={navItems} onClose={() => setIsMenuOpen(false)} />
    </nav>
  )
}

