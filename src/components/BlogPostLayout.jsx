import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';

export default function BlogPostLayout({ post, children }) {
  return (
    <>
      <SEOHead
        title={post.title}
        description={post.description}
        canonical={`/blog/${post.slug}`}
      />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link to="/blog" className="mb-6 inline-block text-sm text-emerald-400 hover:text-emerald-300 transition">
          ← Back to Blog
        </Link>
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {children}
        </article>
      </main>
    </>
  );
}