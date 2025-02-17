"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/app/components/ui/Button"
import { Input } from "@/app/components/ui/Input"
import { Label } from "@/app/components/ui/Label"
import { toast } from "react-hot-toast"

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirmPassword") as string

        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            if (response.ok) {
                toast.success("Account created successfully")
                router.push("/login")
            } else {
                const contentType = response.headers.get("content-type")
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json()
                    throw new Error(data.message || "Something went wrong")
                } else {
                    throw new Error("Something went wrong")
                }
            }
        } catch (error) {
            console.error("Error during sign up:", error)
            toast.error(error instanceof Error ? error.message : "Failed to sign up")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-8">Create an Account</h1>
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                </div>
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                </div>
                <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
            </form>
            <p className="mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-indigo-600 hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    )
}
