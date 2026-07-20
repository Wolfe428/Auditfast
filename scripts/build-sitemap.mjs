import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { BLOG_POSTS, SITE_URL } from '../src/content/blogPosts.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const staticRoutes = ['/', '/blog', '/privacy', '/terms', '/refund-policy']
const blogRoutes = BLOG_POSTS.map((post) => `/blog/${post.slug}`)

const allRoutes = [...staticRoutes, ...blogRoutes]

const today = new Date().toISOString().split('T')[0]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map((route) => `  <url>\n    <loc>${SITE_URL}${route}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
  .join('\n')}
</urlset>
`

const publicDir = path.join(projectRoot, 'public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

const outputPath = path.join(publicDir, 'sitemap.xml')
fs.writeFileSync(outputPath, xml)

console.log(`Sitemap generated at ${outputPath}`)
