import { NextResponse } from "next/server"
import { generateAIResponse } from "@/lib/gemini"
import { withAuth } from "@/app/middleware/withAuth"

export const POST = withAuth(async (req: Request) => {
  try {
    const { action, code, language } = await req.json()

    let prompt: string
    switch (action) {
      case "explain":
        prompt = `Explain the following ${language} code:\n\n${code}`
        break
      case "generate":
        prompt = `Generate a ${language} code snippet that ${code}`
        break
      case "review":
        prompt = `Review the following ${language} code and provide suggestions for improvement:\n\n${code}`
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const response = await generateAIResponse(prompt)
    return NextResponse.json({ result: response })
  } catch (error) {
    console.error("AI feature error:", error)
    return NextResponse.json({ error: "Failed to process AI request" }, { status: 500 })
  }
})

