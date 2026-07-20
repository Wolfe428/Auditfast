const SITE_URL = 'https://www.auditfastpro.com';
const DEFAULT_TITLE = 'AuditFast — AI-Powered CRO Audits in 60 Seconds';
const DEFAULT_DESC = 'Get an instant AI-powered landing page audit. Score your page against 33 CRO heuristics in under 60 seconds. Free, no signup required.';

export default function SEOHead({ title, description, canonical, ogImage }) {
  const pageTitle = title ? `${title} | AuditFast` : DEFAULT_TITLE;
  const pageDesc = description || DEFAULT_DESC;
  const pageUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  // Set document head directly (no extra dependencies needed)
  document.title = pageTitle;

  const setMeta = (name, content, property = false) => {
    const attr = property ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('description', pageDesc);
  setMeta('og:title', pageTitle, true);
  setMeta('og:description', pageDesc, true);
  setMeta('og:url', pageUrl, true);
  setMeta('og:image', ogImage || `${SITE_URL}/og-default.png`, true);
  setMeta('og:type', 'website', true);
  setMeta('og:site_name', 'AuditFast', true);
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', pageTitle);
  setMeta('twitter:description', pageDesc);
  setMeta('twitter:image', ogImage || `${SITE_URL}/og-default.png`);
  setMeta('robots', 'index, follow');

  // Set canonical
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', pageUrl);

  return null;
}