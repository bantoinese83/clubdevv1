"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { config } from "@/lib/config"
import { Button } from "@/app/components/ui/Button"
import { Input } from "@/app/components/ui/Input"
import { Textarea } from "@/app/components/ui/Textarea"
import { toast } from "react-hot-toast"
import { Plus, Trash } from "lucide-react"

type Script = {
  filename: string
  language: string
  code: string
}

export default function ShareCodePage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [scripts, setScripts] = useState<Script[]>([{ filename: "", language: "", code: "" }])
  const [tags, setTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const handleAddScript = () => {
    setScripts([...scripts, { filename: "", language: "", code: "" }])
  }

  const handleRemoveScript = (index: number) => {
    setScripts(scripts.filter((_, i) => i !== index))
  }

  const handleScriptChange = (index: number, field: keyof Script, value: string) => {
    const newScripts = [...scripts]
    newScripts[index][field] = value
    setScripts(newScripts)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      toast.error("You must be logged in to share code.")
      return
    }
    if (scripts.some((script) => script.code.length > config.maxUploadSize)) {
      toast.error(`One or more scripts exceed maximum size of ${config.maxUploadSize / 1024}KB`)
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, scripts, tags }),
      })
      if (response.ok) {
        const data = await response.json()
        router.push(`/snippet/${data.id}`)
      } else {
        throw new Error("Failed to create snippet")
      }
    } catch (error) {
      console.error("Error creating snippet:", error)
      toast.error("Failed to create snippet. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Share Code Snippet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description (optional)
          </label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </div>
        {scripts.map((script, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Script {index + 1}</h3>
              {index > 0 && (
                <Button type="button" onClick={() => handleRemoveScript(index)} variant="ghost" size="sm">
                  <Trash className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>
            <Input
              type="text"
              placeholder="Filename"
              value={script.filename}
              onChange={(e) => handleScriptChange(index, "filename", e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Language"
              value={script.language}
              onChange={(e) => handleScriptChange(index, "language", e.target.value)}
              required
            />
            <Textarea
              placeholder="Code"
              value={script.code}
              onChange={(e) => handleScriptChange(index, "code", e.target.value)}
              required
              rows={10}
            />
          </div>
        ))}
        <Button type="button" onClick={handleAddScript} variant="outline">
          <Plus className="w-4 h-4 mr-1" />
          Add Another Script
        </Button>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <Input
            type="text"
            id="tags"
            value={tags.join(", ")}
            onChange={(e) => setTags(e.target.value.split(",").map((tag) => tag.trim()))}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Sharing..." : "Share Snippet"}
        </Button>
      </form>
    </div>
  )
}

