import BlogPostLayout from '../components/BlogPostLayout.jsx'
import { getBlogPostBySlug } from '../content/blogPosts.js'

const post = getBlogPostBySlug('cro-checklist')

export default function BlogCROChecklist() {
  return (
    <BlogPostLayout post={post}>
      <main className="mx-auto max-w-3xl px-6 pb-16 pt-32">
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <h1>Landing Page Audit Checklist: 20 CRO Issues That Kill Conversions</h1>
        <p className="text-gray-500">
          Target keyword: landing page audit, CRO audit, conversion rate optimization checklist
        </p>

        <p>
          If you're driving traffic to your landing page but not seeing signups, you don't need more traffic — you need a landing page audit. Most conversion issues are surprisingly consistent across SaaS, ecommerce, and content sites.
        </p>
        <p>
          Below is our 20-point checklist, based on 33 CRO heuristics used by{" "}
          <a href="https://www.auditfastpro.com">AuditFast's AI audit engine</a>.
        </p>

        <hr />

        <h2>Above the Fold (Points 1–5)</h2>

        <h3>1. Does your headline communicate the outcome, not the feature?</h3>
        <p><strong>Bad:</strong> <em>"AI-Powered CRO Audits"</em><br /><strong>Good:</strong> <em>"Fix the leaks in your landing page in 60 seconds"</em></p>
        <p>Visitors decide within 3–5 seconds whether to stay. If your headline describes <em>what you built</em> instead of <em>what they get</em>, you've lost them.</p>

        <h3>2. Is your value proposition visible without scrolling?</h3>
        <p>The first screenful should answer: <em>What is this? Why should I care? What do I do next?</em> If users have to scroll to understand your offer, most won't.</p>

        <h3>3. Is there one clear primary CTA?</h3>
        <p>A single primary action per viewport. "Get Started" or "Get My Score" — one button, one job. Multiple competing CTAs dilute attention.</p>

        <h3>4. Does your CTA button communicate the outcome?</h3>
        <p><strong>Bad:</strong> <em>Submit</em>, <em>Click Here</em>, <em>Go</em><br /><strong>Good:</strong> <em>Get My Free Audit</em>, <em>Start Converting Now</em>, <em>See Your Score</em></p>

        <h3>5. Is your subheadline reinforcing the headline?</h3>
        <p>Don't waste the subheadline. Use it to add specificity: <em>"Audit your landing page against the same 33 heuristics a $2,500 consultant would use."</em></p>

        <hr />

        <h2>Copy &amp; Messaging (Points 6–10)</h2>
        <h3>6. Do you lead with benefits, not features?</h3>
        <p>Features describe your product. Benefits describe the visitor's improved life. Every feature should be followed by <em>"...which means you can..."</em></p>

        <h3>7. Is your copy specific or generic?</h3>
        <p><strong>Vague:</strong> <em>"We help businesses grow"</em><br /><strong>Specific:</strong> <em>"We help SaaS founders turn 1.4% conversion rates into 3.1%"</em></p>

        <h3>8. Do you address the visitor's situation?</h3>
        <p>The best landing pages speak directly to the visitor's pain. If the copy could apply to anyone, it resonates with no one.</p>

        <h3>9. Is your social proof credible and visible?</h3>
        <ul>
          <li>Customer logos (real companies, not stock graphics)</li>
          <li>Testimonial with specific results (not "great product!")</li>
          <li>Number of users/customers if impressive</li>
        </ul>

        <h3>10. Do you have unnecessary jargon?</h3>
        <p>"Synergize," "leverage," "paradigm shift" — cut them. Write like a smart human, not a corporate brochure.</p>

        <hr />

        <h2>Trust &amp; Credibility (Points 11–14)</h2>
        <h3>11. Are testimonials specific?</h3>
        <p><strong>Generic:</strong> <em>"Great product, highly recommend!"</em><br /><strong>Specific:</strong> <em>"After fixing the 3 issues AuditFast found, our conversion rate went from 1.4% to 3.1%."</em> — Sarah, Founder at GrowthBee</p>

        <h3>12. Do trust signals match the visitor's awareness stage?</h3>
        <p>Early-stage visitors need logos. Late-stage visitors need case studies and guarantees.</p>

        <h3>13. Is there a guarantee or risk reversal?</h3>
        <p><em>"Free audit. No credit card required. No subscription."</em> — removes the fear of commitment.</p>

        <h3>14. Are trust signals buried below the fold?</h3>
        <p>If testimonials are three scrolls deep, most visitors never see them. Place trust signals where they'll actually be seen.</p>

        <hr />

        <h2>Layout &amp; UX (Points 15–18)</h2>
        <h3>15. Is there visual hierarchy?</h3>
        <p>The most important element should be the most visually prominent. Use size, color, and whitespace to guide the eye.</p>

        <h3>16. Is the page fully responsive on mobile?</h3>
        <p>Over 60% of traffic is mobile. If your mobile layout is an afterthought, you're losing more than half your potential conversions.</p>

        <h3>17. Are distractions minimized above the fold?</h3>
        <p>Navigation links, secondary CTAs, and social media icons above the fold give visitors an exit route before they've understood your offer.</p>

        <h3>18. Does the page feel fast?</h3>
        <p>Skeleton screens, progressive loading, and optimized images keep visitors engaged while content loads.</p>

        <hr />

        <h2>CTA &amp; Conversion (Points 19–20)</h2>
        <h3>19. Do secondary CTAs compete with the primary?</h3>
        <p>A "Learn More" link next to your "Get Started" button is an escape hatch. Secondary CTAs should be visually distinct and placed <em>after</em> the primary message.</p>

        <h3>20. Is there a clear next step after the CTA?</h3>
        <p>What happens after they click? If the signup flow is broken or confusing, you'll lose them at the last step.</p>

        <hr />

        <h2>Run Your Own Landing Page Audit</h2>
        <p>
          Don't guess which issues are hurting your conversions. Use{" "}
          <a href="https://www.auditfastpro.com">AuditFast's free AI audit</a>{" "}
          to score your landing page against all 33 heuristics in under 60 seconds — no signup required.
        </p>
        <p>
          <a href="https://www.auditfastpro.com" className="inline-block rounded-lg bg-emerald-500 px-6 py-3 text-white font-semibold hover:bg-emerald-600">
            Get Your Free Audit →
          </a>
        </p>
      </article>
      </main>
    </BlogPostLayout>
  )
}