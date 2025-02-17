import {NextResponse} from "next/server"
import {PrismaClient} from "@prisma/client"
import {hashPassword} from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const {email, password, name} = await request.json()

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {email},
        })

        if (existingUser) {
            return NextResponse.json({message: "User already exists"}, {status: 400})
        }

        // Hash the password
        const hashedPassword = await hashPassword(password)

        // Create the new user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name, // Include the name property
            },
        })

        return NextResponse.json({message: "User created successfully"}, {status: 201})
    } catch (error) {
        console.error("Error in signup:", error)
        return NextResponse.json({message: "Internal server error"}, {status: 500})
    }
}