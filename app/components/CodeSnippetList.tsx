import { CodeSnippet } from "./CodeSnippet"

type Script = {
  id: string
  filename: string
  language: string
  code: string
  createdAt: Date
  updatedAt: Date
}

type Snippet = {
  id: string
  title: string
  language: string
  author_name: string
  likes: number
  scripts: Script[]
}

type CodeSnippetListProps = {
  snippets: Snippet[]
}

export function CodeSnippetList({ snippets }: CodeSnippetListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {snippets.map((snippet) => (
        <CodeSnippet key={snippet.id} snippet={snippet} />
      ))}
    </div>
  )
}