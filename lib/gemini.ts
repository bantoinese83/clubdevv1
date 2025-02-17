import { GoogleGenerativeAI } from "@google/generative-ai"

const API_KEY = process.env.GEMINI_API_KEY

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables")
}

const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" })

export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error("Error generating AI response:", error)
    throw new Error("Failed to generate AI response")
  }
}

