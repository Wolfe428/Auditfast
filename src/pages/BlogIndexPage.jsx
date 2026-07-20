import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { blogPosts } from '../content/blogPosts';

export default function BlogIndexPage() {
  return (
    <>
      <SEOHead
        title="CRO Blog — Landing Page Optimization Guides"
        description="Actionable guides on landing page optimization, CRO heuristics, and conversion rate improvement for indie founders and SaaS owners."
        canonical="/blog"
      />
      <main className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        <h1 className="text-4xl font-bold text-white mb-2">CRO Blog</h1>
        <p className="text-gray-400 mb-12 text-lg">
          Actionable guides on landing page optimization, CRO heuristics, and conversion rate improvement.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-emerald-500/50 transition group"
            >
              <time className="text-xs text-gray-500">{post.date}</time>
              <h2 className="mt-2 text-lg font-semibold text-white group-hover:text-emerald-400 transition">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-gray-400 line-clamp-3">
                {post.description}
              </p>
              <span className="mt-3 inline-block text-sm text-emerald-400 group-hover:text-emerald-300 transition">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}