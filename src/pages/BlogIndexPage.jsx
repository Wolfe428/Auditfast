import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import SEOHead from '../components/SEOHead.jsx'
import { BLOG_POSTS, SITE_URL } from '../content/blogPosts.js'

export default function BlogIndexPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'AuditFast Blog',
    description: 'Conversion-focused guides for landing page copy, UX, and CRO audits.',
    url: `${SITE_URL}/blog`,
    blogPost: BLOG_POSTS.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      author: {
        '@type': 'Organization',
        name: 'AuditFast',
      },
    })),
  }

  return (
    <>
      <SEOHead
        title="AuditFast Blog — CRO Guides for Better Landing Page Conversions"
        description="Read practical CRO guides and landing page optimization playbooks for indie founders and small SaaS teams."
        path="/blog"
        keywords={[
          'landing page optimization',
          'conversion rate optimization',
          'CRO guides',
          'SaaS marketing blog',
        ]}
        structuredData={structuredData}
      />

      <Header />
      <main className="min-h-screen bg-gray-950 px-6 pb-16 pt-32 text-white">
        <section className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">AuditFast Blog</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">CRO playbooks for founders who want more conversions</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Step-by-step breakdowns, audit checklists, and messaging frameworks to help you improve landing page performance without hiring a consultant.
          </p>

          <div className="mt-10 grid gap-6">
            {BLOG_POSTS.map((post) => (
              <article key={post.slug} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  {post.publishedAt} • {post.readingTime}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  <Link to={`/blog/${post.slug}`} className="hover:text-emerald-300">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 text-gray-300">{post.description}</p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Read article →
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
