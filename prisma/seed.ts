"use client"

import {PrismaClient} from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()
const hash = bcrypt.hash

async function main() {
    // Create sample users
    const user1 = await prisma.user.create({
        data: {
            name: "John Doe",
            email: "john@example.com",
            password: await hash("password123", 12),
            skills: ["JavaScript", "React", "Node.js"],
            points: 150,
        },
    })

    const user2 = await prisma.user.create({
        data: {
            name: "Jane Smith",
            email: "jane@example.com",
            password: await hash("password456", 12),
            skills: ["Python", "Django", "Machine Learning"],
            points: 1200,
        },
    })

    // Create sample snippets
    await prisma.snippet.create({
        data: {
            title: "React Hook Example",
            description: "A simple React hook for managing state",
            userId: user1.id,
            tags: ["React", "Hooks", "JavaScript"],
            scripts: {
                create: [
                    {
                        filename: "useCounter.js",
                        language: "JavaScript",
                        code: `
      import { useState } from 'react';
      
      function useCounter(initialCount = 0) {
        const [count, setCount] = useState(initialCount);
      
        const increment = () => setCount(c => c + 1);
        const decrement = () => setCount(c => c - 1);
        const reset = () => setCount(initialCount);
      
        return { count, increment, decrement, reset };
      }
      
      export default useCounter;
                  `,
                    },
                ],
            },
        },
    })

    await prisma.snippet.create({
        data: {
            title: "Python Data Analysis",
            description: "Basic data analysis using pandas",
            userId: user2.id,
            tags: ["Python", "Pandas", "Data Analysis"],
            scripts: {
                create: [
                    {
                        filename: "data_analysis.py",
                        language: "Python",
                        code: `
      import pandas as pd
      import matplotlib.pyplot as plt
      
      # Load data
      df = pd.read_csv('data.csv')
      
      # Basic statistics
      print(df.describe())
      
      # Plot histogram
      df['age'].hist()
      plt.title('Age Distribution')
      plt.xlabel('Age')
      plt.ylabel('Frequency')
      plt.show()
                  `,
                    },
                ],
            },
        },
    })

    // Create badges
    const badges = [
        {
            name: "Century",
            description: "Earned 100 points",
            imageUrl: "/badges/century.png",
        },
        {
            name: "Millennium",
            description: "Earned 1000 points",
            imageUrl: "/badges/millennium.png",
        },
        {
            name: "Coder",
            description: "Shared 5 snippets",
            imageUrl: "/badges/coder.png",
        },
        {
            name: "Prolific",
            description: "Shared 20 snippets",
            imageUrl: "/badges/prolific.png",
        },
    ]

    for (const badge of badges) {
        await prisma.badge.create({
            data: badge,
        })
    }

    // Assign badges to users based on their points
    await prisma.user.update({
        where: {id: user1.id},
        data: {
            badges: {
                connect: [{name: "Century"}],
            },
        },
    })

    await prisma.user.update({
        where: {id: user2.id},
        data: {
            badges: {
                connect: [{name: "Century"}, {name: "Millennium"}],
            },
        },
    })

    console.log("Sample data and badges seeded successfully")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })