interface WebsiteStructuredDataProps {
  name: string
  alternateName?: string
  url: string
}

export function WebsiteStructuredData({ name, alternateName, url }: WebsiteStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: name,
    alternateName: alternateName,
    url: url,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}

interface CodeSnippetStructuredDataProps {
  name: string
  description: string
  author: string
  datePublished: string
  programmingLanguage: string
  codeRepositoryUrl: string
}

export function CodeSnippetStructuredData({
  name,
  description,
  author,
  datePublished,
  programmingLanguage,
  codeRepositoryUrl,
}: CodeSnippetStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: name,
    description: description,
    author: {
      "@type": "Person",
      name: author,
    },
    datePublished: datePublished,
    programmingLanguage: programmingLanguage,
    codeRepository: codeRepositoryUrl,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}

interface PersonStructuredDataProps {
  name: string
  description: string
  image: string
  url: string
}

export function PersonStructuredData({ name, description, image, url }: PersonStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: name,
    description: description,
    image: image,
    url: url,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}

