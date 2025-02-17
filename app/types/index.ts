export interface User {
    id: string
    name: string
    username: string
    email: string
    bio?: string
    skills?: string[]
    points: number
    badges: Badge[]
}

export interface Badge {
    id: string
    name: string
    description: string
    imageUrl: string
}

export interface CodeSnippet {
    id: string
    title: string
    description?: string
    scripts: Script[]
    author: User
    likes: number
    comments: number
    tags: string[]
    createdAt: Date
    updatedAt: Date
}

export interface Script {
    id: string
    filename: string
    language: string
    code: string
    createdAt: Date
    updatedAt: Date
}

export interface Comment {
    id: string
    content: string
    author: User
    snippet: CodeSnippet
    createdAt: Date
    updatedAt: Date
}

export interface SearchFilters {
    language?: string
    tags?: string[]
    sortBy: "popularity" | "date" | "rating"
}

