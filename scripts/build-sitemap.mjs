// Generates sitemap.xml from blogPosts metadata
// Run: node scripts/build-sitemap.mjs > public/sitemap.xml

const SITE_URL = 'https://www.auditfastpro.com';

const pages = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.9' },
  { loc: '/privacy', changefreq: 'monthly', priority: '0.3' },
  { loc: '/terms', changefreq: 'monthly', priority: '0.3' },
  { loc: '/refund-policy', changefreq: 'monthly', priority: '0.3' },
];

// Dynamically import blog posts
import('../src/content/blogPosts.js').then(({ blogPosts }) => {
  blogPosts.forEach((post) => {
    pages.push({
      loc: `/blog/${post.slug}`,
      changefreq: 'monthly',
      priority: '0.8',
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  console.log(xml);
}).catch(() => {
  // Fallback static output
  console.log('<?xml version="1.0" encoding="UTF-8"?>');
  console.log('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  pages.forEach((p) => {
    console.log(`  <url>\n    <loc>${SITE_URL}${p.loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`);
  });
  console.log('</urlset>');
});