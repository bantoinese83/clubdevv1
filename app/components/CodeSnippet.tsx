"use client"

import type React from "react"

import {useState} from "react"
import Link from "next/link"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter"
import {tomorrow} from "react-syntax-highlighter/dist/esm/styles/prism"
import {Heart, MessageSquare, Copy, Download, Lightbulb, Code, CheckCircle} from "lucide-react"
import {CommentList} from "./CommentList"
import {CommentForm} from "./CommentForm"
import {toast} from "react-hot-toast"
import {useSnippet} from "@/app/hooks/useSnippet"
import {useAnalytics} from "@/app/hooks/useAnalytics"
import {Card, CardHeader, CardContent, CardFooter} from "@/app/components/ui/Card"
import {Button} from "@/app/components/ui/Button"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/app/components/ui/Tabs"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/app/components/ui/Dialog"

type Script = {
    id: string
    filename: string
    language: string
    code: string
}

type CodeSnippetProps = {
    snippet: {
        id: string
        title: string
        description?: string
        scripts: Script[]
        author_name: string
        likes: number
    }
}

const CodeViewer = ({
                        script,
                        isExpanded,
                        onToggleExpand,
                    }: { script: Script; isExpanded: boolean; onToggleExpand: () => void }) => (
    <div className="relative">
        <SyntaxHighlighter
            language={script.language.toLowerCase()}
            style={tomorrow}
            customStyle={{
                maxHeight: isExpanded ? "none" : "200px",
                overflow: "hidden",
            }}
        >
            {script.code}
        </SyntaxHighlighter>
        {!isExpanded && (
            <div
                className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
        )}
        <button onClick={onToggleExpand} className="text-indigo-600 dark:text-indigo-400 hover:underline mt-2">
            {isExpanded ? "Show less" : "Show more"}
        </button>
    </div>
)

const ActionButtons = ({
                           onLike,
                           likes,
                           isLiking,
                           onToggleComments,
                           onCopy,
                           onDownload,
                       }: {
    onLike: () => void
    likes: number
    isLiking: boolean
    onToggleComments: () => void
    onCopy: () => void
    onDownload: () => void
}) => (
    <div className="flex justify-between items-center">
        <div className="flex space-x-4">
            <Button onClick={onLike} variant="ghost" size="sm" className="flex items-center" disabled={isLiking}>
                <Heart className={`w-5 h-5 mr-1 ${likes > 0 ? "fill-current" : ""}`}/>
                <span>{likes}</span>
            </Button>
            <Button onClick={onToggleComments} variant="ghost" size="sm" className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-1"/>
                <span>Comments</span>
            </Button>
        </div>
        <div className="flex space-x-2">
            <Button onClick={onCopy} variant="ghost" size="sm" aria-label="Copy code to clipboard">
                <Copy className="w-5 h-5"/>
            </Button>
            <Button onClick={onDownload} variant="ghost" size="sm" aria-label="Download code">
                <Download className="w-5 h-5"/>
            </Button>
        </div>
    </div>
)

const AIFeatureButton = ({
                             icon: Icon,
                             label,
                             onClick,
                         }: { icon: React.ElementType; label: string; onClick: () => void }) => (
    <Button onClick={onClick} variant="outline" size="sm" className="flex items-center">
        <Icon className="w-4 h-4 mr-2"/>
        {label}
    </Button>
)

const AIResponseDialog = ({
                              isOpen,
                              onClose,
                              title,
                              content,
                          }: { isOpen: boolean; onClose: () => void; title: string; content: string }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="mt-4 max-h-96 overflow-y-auto">
                <SyntaxHighlighter language="plaintext" style={tomorrow}>
                    {content}
                </SyntaxHighlighter>
            </div>
        </DialogContent>
    </Dialog>
)

export function CodeSnippet({snippet}: CodeSnippetProps) {
    const [expandedScripts, setExpandedScripts] = useState<Record<string, boolean>>({})
    const [showComments, setShowComments] = useState(false)
    const {likes, isLiking, handleLike} = useSnippet(snippet.likes)
    const {trackEvent} = useAnalytics()
    const [aiResponse, setAiResponse] = useState("")
    const [aiDialogOpen, setAiDialogOpen] = useState(false)
    const [aiDialogTitle, setAiDialogTitle] = useState("")

    const toggleExpand = (scriptId: string) => {
        setExpandedScripts((prev) => ({...prev, [scriptId]: !prev[scriptId]}))
    }

    const handleCopy = async (script: Script) => {
        try {
            await navigator.clipboard.writeText(script.code)
            toast.success("Code copied to clipboard!")
            trackEvent("code_copied", {snippet_id: snippet.id, language: script.language})
        } catch (error) {
            console.error("Error copying code:", error)
            toast.error("Failed to copy code. Please try again.")
        }
    }

    const handleDownload = (script: Script) => {
        try {
            const element = document.createElement("a")
            const file = new Blob([script.code], {type: "text/plain"})
            element.href = URL.createObjectURL(file)
            element.download = script.filename
            document.body.appendChild(element)
            element.click()
            document.body.removeChild(element)
            toast.success("Code downloaded successfully!")
            trackEvent("code_downloaded", {snippet_id: snippet.id, language: script.language})
        } catch (error) {
            console.error("Error downloading code:", error)
            toast.error("Failed to download code. Please try again.")
        }
    }

    const handleLikeWithTracking = async () => {
        await handleLike(snippet.id)
        trackEvent("snippet_liked", {snippet_id: snippet.id})
    }

    const handleAIFeature = async (action: "explain" | "generate" | "review", script: Script) => {
        try {
            const response = await fetch("/api/ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action,
                    code: script.code,
                    language: script.language,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to process AI request")
            }

            const data = await response.json()
            setAiResponse(data.result)
            setAiDialogOpen(true)
            setAiDialogTitle(
                action === "explain" ? "Code Explanation" : action === "generate" ? "Generated Code" : "Code Review",
            )
            trackEvent(`ai_${action}_used`, {snippet_id: snippet.id, language: script.language})
        } catch (error) {
            console.error(`Error using AI ${action} feature:`, error)
            toast.error(`Failed to ${action} code. Please try again.`)
        }
    }

    return (
        <Card>
            <CardHeader>
                <Link href={`/snippet/${snippet.id}`} className="text-lg font-semibold mb-2 hover:text-indigo-600">
                    {snippet.title}
                </Link>
                <div className="text-sm text-gray-500 dark:text-gray-400">by {snippet.author_name}</div>
            </CardHeader>
            <CardContent>
                {snippet.description && <p className="mb-4">{snippet.description}</p>}
                {snippet.scripts && snippet.scripts.length > 0 && (
                    <Tabs defaultValue={snippet.scripts[0].id}>
                        <TabsList>
                            {snippet.scripts.map((script) => (
                                <TabsTrigger key={script.id} value={script.id}>
                                    {script.filename}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {snippet.scripts.map((script) => (
                            <TabsContent key={script.id} value={script.id}>
                                <CodeViewer
                                    script={script}
                                    isExpanded={expandedScripts[script.id] || false}
                                    onToggleExpand={() => toggleExpand(script.id)}
                                />
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <AIFeatureButton
                                        icon={Lightbulb}
                                        label="Explain Code"
                                        onClick={() => handleAIFeature("explain", script)}
                                    />
                                    <AIFeatureButton
                                        icon={Code}
                                        label="Generate Similar"
                                        onClick={() => handleAIFeature("generate", script)}
                                    />
                                    <AIFeatureButton
                                        icon={CheckCircle}
                                        label="Review Code"
                                        onClick={() => handleAIFeature("review", script)}
                                    />
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                )}
            </CardContent>
            <CardFooter>
                <ActionButtons
                    onLike={handleLikeWithTracking}
                    likes={likes}
                    isLiking={isLiking}
                    onToggleComments={() => {
                        setShowComments(!showComments)
                        if (!showComments) {
                            trackEvent("comments_viewed", {snippet_id: snippet.id})
                        }
                    }}
                    onCopy={() => snippet.scripts && snippet.scripts.length > 0 && handleCopy(snippet.scripts[0])}
                    onDownload={() => snippet.scripts && snippet.scripts.length > 0 && handleDownload(snippet.scripts[0])}
                />
            </CardFooter>
            {showComments && (
                <CardContent>
                    <CommentForm snippetId={snippet.id} onCommentAddedAction={() => {
                    }}/>
                    <CommentList snippetId={snippet.id}/>
                </CardContent>
            )}
            <AIResponseDialog
                isOpen={aiDialogOpen}
                onClose={() => setAiDialogOpen(false)}
                title={aiDialogTitle}
                content={aiResponse}
            />
        </Card>
    )
}