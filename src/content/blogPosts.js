export const SITE_URL = 'https://www.auditfastpro.com'

export const BLOG_POSTS = [
  {
    slug: 'cro-checklist',
    title: 'Landing Page Audit Checklist: 20 CRO Issues That Kill Conversions',
    description:
      'A practical 20-point CRO checklist to audit copy, UX, trust signals, and CTA clarity on SaaS landing pages.',
    keywords: ['landing page audit', 'CRO audit', 'conversion rate optimization checklist'],
    publishedAt: '2026-07-16',
    updatedAt: '2026-07-16',
    readingTime: '10 min read',
  },
  {
    slug: 'cro-for-founders',
    title: 'Conversion Rate Optimization for Indie Founders: The Practical Playbook',
    description:
      'A practical CRO playbook for indie founders: common conversion leaks, high-impact fixes, and a simple testing workflow.',
    keywords: ['conversion rate optimization', 'SaaS landing page tips', 'indie founders CRO'],
    publishedAt: '2026-07-16',
    updatedAt: '2026-07-16',
    readingTime: '9 min read',
  },
  {
    slug: 'cro-heuristics-guide',
    title: 'The Complete CRO Heuristics Guide: 33 Ways to Optimize Your Landing Page',
    description:
      'A complete guide to the 33 CRO heuristics used by AuditFast to evaluate copy, layout, trust, CTA performance, and UX.',
    keywords: ['CRO heuristics', 'CRO audit framework', 'conversion rate optimization'],
    publishedAt: '2026-07-16',
    updatedAt: '2026-07-16',
    readingTime: '12 min read',
  },
  {
    slug: '10-common-conversion-killers',
    title: '10 Common Conversion Killers (And How AuditFast Spots Them)',
    description:
      'The 10 landing page mistakes that silently hurt signups and sales, plus practical fixes you can implement this week.',
    keywords: ['conversion killers', 'CRO mistakes', 'landing page errors'],
    publishedAt: '2026-07-16',
    updatedAt: '2026-07-16',
    readingTime: '6 min read',
  },
  {
    slug: 'headline-formulas-that-convert',
    title: '5 Headline Formulas That Double Landing Page Conversions',
    description:
      'Five battle-tested headline formulas with examples for SaaS founders who want more signups from existing traffic.',
    keywords: ['headline formulas', 'CRO copywriting', 'conversion copywriting'],
    publishedAt: '2026-07-16',
    updatedAt: '2026-07-16',
    readingTime: '5 min read',
  },
]

export function getBlogPostBySlug(slug) {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

export function getPostUrl(slug) {
  return `${SITE_URL}/blog/${slug}`
}
