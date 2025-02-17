"use client"

import Head from "next/head"
import {usePathname} from "next/navigation"

interface SEOProps {
    title: string
    description: string
    image?: string
    type?: "website" | "article"
    date?: string
}

export function SEO({title, description, image, type = "website", date}: SEOProps) {
    const pathname = usePathname()
    const url = `https://clubdev.com${pathname}`
    const siteName = "ClubDev"

    return (
        <Head>
            <title>{`${title} | ${siteName}`}</title>
            <meta name="description" content={description}/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="icon" href="/favicon.ico"/>

            {/* Open Graph */}
            <meta property="og:url" content={url}/>
            <meta property="og:description" content={description}/>
            <meta property="og:site_name" content={siteName}/>
            {image && <meta property="og:image" content={image}/>}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={title}/>
            <meta name="twitter:description" content={description}/>
            {image && <meta name="twitter:image" content={image}/>}

            {/* Article specific */}
            <>
                <meta property="article:published_time" content={date}/>
                <meta name="publish_date" property="og:publish_date" content={date}/>
                <meta name="author" property="article:author" content={siteName}/>
            </>
            ){"}"}
        </Head>
    )
}