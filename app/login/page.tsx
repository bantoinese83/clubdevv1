"use client"

import type React from "react"

import { signIn } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/app/components/ui/Button"
import { Input } from "@/app/components/ui/Input"
import { Label } from "@/app/components/ui/Label"
import { Mail } from "lucide-react"
import { toast } from "react-hot-toast"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (provider: string) => {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl: "/" })
    } catch (error) {
      console.error("Error during sign in:", error)
      toast.error("Failed to sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      toast.success("Logged in successfully")
      window.location.href = "/"
    } catch (error) {
      console.error("Error during login:", error)
      toast.error(error instanceof Error ? error.message : "Failed to log in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Sign In to ClubDev</h1>
      <div className="space-y-4 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <Button onClick={() => handleSignIn("github")} className="w-full" disabled={isLoading}>
        </Button>
        <Button onClick={() => handleSignIn("google")} className="w-full" disabled={isLoading}>
          <Mail className="mr-2 h-4 w-4" /> Sign in with Google
        </Button>
      </div>
      <p className="mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-indigo-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}