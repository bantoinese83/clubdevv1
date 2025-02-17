import { NextResponse } from "next/server"
import { ZodError } from "zod"

export function apiErrorHandler(error: unknown) {
  console.error("API Error:", error)

  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
}

