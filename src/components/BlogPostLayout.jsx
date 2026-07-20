import Header from './Header.jsx'
import Footer from './Footer.jsx'
import SEOHead from './SEOHead.jsx'
import { SITE_URL } from '../content/blogPosts.js'

export default function BlogPostLayout({ post, children }) {
  const path = `/blog/${post.slug}`
  const url = `${SITE_URL}${path}`

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        author: {
          '@type': 'Organization',
          name: 'AuditFast',
        },
        publisher: {
          '@type': 'Organization',
          name: 'AuditFast',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/favicon.svg`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${SITE_URL}/blog`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: url,
          },
        ],
      },
    ],
  }

  return (
    <>
      <SEOHead
        title={`${post.title} | AuditFast Blog`}
        description={post.description}
        path={path}
        type="article"
        image="/og-default.png"
        keywords={post.keywords}
        publishedTime={post.publishedAt}
        modifiedTime={post.updatedAt}
        structuredData={structuredData}
      />
      <Header />
      {children}
      <Footer />
    </>
  )
}
