import { useEffect } from 'react'
import { SITE_URL } from '../content/blogPosts.js'

function upsertMeta({ selector, attr, value, content }) {
  let el = document.head.querySelector(selector)

  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, value)
    document.head.appendChild(el)
  }

  el.setAttribute('content', content)
}

function upsertLink({ rel, href }) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)

  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }

  el.setAttribute('href', href)
}

function removeMeta(selector) {
  const el = document.head.querySelector(selector)
  if (el) el.remove()
}

export default function SEOHead({
  title,
  description,
  path = '/',
  type = 'website',
  image = '/og-default.png',
  keywords = [],
  publishedTime,
  modifiedTime,
  noindex = false,
  structuredData,
}) {
  useEffect(() => {
    const canonical = path.startsWith('http') ? path : `${SITE_URL}${path}`
    const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`
    const keywordsContent = Array.isArray(keywords) ? keywords.join(', ') : keywords

    document.title = title

    upsertMeta({ selector: 'meta[name="description"]', attr: 'name', value: 'description', content: description })
    upsertMeta({ selector: 'meta[name="robots"]', attr: 'name', value: 'robots', content: noindex ? 'noindex, nofollow' : 'index, follow' })

    if (keywordsContent) {
      upsertMeta({ selector: 'meta[name="keywords"]', attr: 'name', value: 'keywords', content: keywordsContent })
    } else {
      removeMeta('meta[name="keywords"]')
    }

    upsertMeta({ selector: 'meta[property="og:title"]', attr: 'property', value: 'og:title', content: title })
    upsertMeta({ selector: 'meta[property="og:description"]', attr: 'property', value: 'og:description', content: description })
    upsertMeta({ selector: 'meta[property="og:type"]', attr: 'property', value: 'og:type', content: type })
    upsertMeta({ selector: 'meta[property="og:url"]', attr: 'property', value: 'og:url', content: canonical })
    upsertMeta({ selector: 'meta[property="og:image"]', attr: 'property', value: 'og:image', content: imageUrl })

    upsertMeta({ selector: 'meta[name="twitter:card"]', attr: 'name', value: 'twitter:card', content: 'summary_large_image' })
    upsertMeta({ selector: 'meta[name="twitter:title"]', attr: 'name', value: 'twitter:title', content: title })
    upsertMeta({ selector: 'meta[name="twitter:description"]', attr: 'name', value: 'twitter:description', content: description })
    upsertMeta({ selector: 'meta[name="twitter:image"]', attr: 'name', value: 'twitter:image', content: imageUrl })

    if (publishedTime) {
      upsertMeta({
        selector: 'meta[property="article:published_time"]',
        attr: 'property',
        value: 'article:published_time',
        content: new Date(publishedTime).toISOString(),
      })
    } else {
      removeMeta('meta[property="article:published_time"]')
    }

    if (modifiedTime) {
      upsertMeta({
        selector: 'meta[property="article:modified_time"]',
        attr: 'property',
        value: 'article:modified_time',
        content: new Date(modifiedTime).toISOString(),
      })
    } else {
      removeMeta('meta[property="article:modified_time"]')
    }

    upsertLink({ rel: 'canonical', href: canonical })

    const priorScripts = document.head.querySelectorAll('script[data-managed-seo="true"]')
    priorScripts.forEach((script) => script.remove())

    if (structuredData) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.managedSeo = 'true'
      script.text = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }
  }, [title, description, path, type, image, keywords, publishedTime, modifiedTime, noindex, structuredData])

  return null
}
