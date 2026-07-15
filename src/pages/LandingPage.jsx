import { useState } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { auditLandingPage } from '../services/auditApi.js'
import { getProPaymentLink } from '../services/stripeConfig.js'

const trustCards = [
  {
    title: 'What AuditFast does',
    body: 'AuditFast gives founders a fast, AI-powered CRO audit for public landing pages. Paste a URL and get a clear first-pass review of your copy, layout, UX, trust signals, and CTA clarity in under 60 seconds.',
    accent: 'from-emerald-500/20 to-emerald-500/5',
  },
  {
    title: 'Privacy, kept simple',
    body: 'We only use the URL you submit and the page content needed to generate your audit. No analytics login or CMS access required. Payments are handled by Stripe. We do not sell your data.',
    accent: 'from-cyan-500/20 to-cyan-500/5',
  },
  {
    title: 'One-time pricing',
    body: 'No credit card required for the free audit. Pro is a one-time $10 purchase, not a subscription. Get the full report, copy rewrites, UX suggestions, and a prioritized action plan.',
    accent: 'from-violet-500/20 to-violet-500/5',
  },
  {
    title: 'Refund policy',
    body: 'If you were charged and your report did not generate, was blank, or was clearly broken, contact us within 7 days and we will fix the issue or refund the payment.',
    accent: 'from-amber-500/20 to-amber-500/5',
  },
]

const faqs = [
  {
    question: 'What do I get for free?',
    answer:
      'A quick summary of the 3 biggest issues we found plus a conversion score for the page you submitted.',
  },
  {
    question: 'What do I get with Pro?',
    answer:
      'The full report with specific copy rewrites, UX improvement suggestions, and a prioritized action plan.',
  },
  {
    question: 'Does AuditFast guarantee better conversions?',
    answer:
      'No. AuditFast helps you spot likely friction and prioritize improvements, but results still depend on your offer, traffic quality, implementation, and testing.',
  },
  {
    question: 'Do I need to install anything?',
    answer:
      'No. Paste a public landing page URL and AuditFast handles the analysis for you.',
  },
  {
    question: 'What kind of pages work best?',
    answer:
      'Public landing pages, sales pages, homepage-style pages, and waitlists with a clear conversion goal.',
  },
  {
    question: 'How do refunds work?',
    answer:
      'If your paid report fails to generate correctly, contact us within 7 days and we will fix it or refund it. Because Pro reports are generated instantly, we usually cannot offer refunds after a report has been successfully delivered.',
  },
]

const DEFAULT_SHARE_URL = 'https://75a83e8f4741fe695a3b2e25a36b9f8c.ctonew.app'

function cleanIssueTitle(issue) {
  if (!issue?.title) return 'an important conversion issue'

  return issue.title
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .toLowerCase()
}

function getShareUrl() {
  if (typeof window === 'undefined') return DEFAULT_SHARE_URL
  return window.location.origin || DEFAULT_SHARE_URL
}

function buildTweetText({ score, issues }) {
  const shareUrl = getShareUrl()
  const firstIssue = cleanIssueTitle(issues?.[0])

  if (score >= 80) {
    return `Ran my landing page through AuditFast and got ${score}/100. Not bad for a first draft, but the audit picked up ${firstIssue} I hadn't considered. Free tool, no sign-up required.\n\n${shareUrl}`
  }

  if (score >= 50) {
    const issueSnippets = (issues || [])
      .slice(0, 3)
      .map((issue) => cleanIssueTitle(issue))

    const [issue1 = 'headline clarity gaps', issue2 = 'CTA friction', issue3 = 'weak trust signals'] = issueSnippets

    return `My landing page scored ${score}/100 on AuditFast. Found 3 things to fix — ${issue1}, ${issue2}, and ${issue3}. Easy wins.\n\nCheck yours: ${shareUrl}`
  }

  return `AuditFast gave my landing page a ${score}/100. Brutal but fair. The good news: I now have a prioritized list of exactly what to fix. $10 for the full report is cheaper than my coffee habit this month.\n\n😬 Get your score: ${shareUrl}`
}

export default function LandingPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [proUnlocked, setProUnlocked] = useState(false)
  const [shareMessage, setShareMessage] = useState('')

  async function handleFreeAudit(e) {
    e.preventDefault()
    setError('')
    setShareMessage('')

    if (!url.trim()) {
      setError('Please enter a landing page URL')
      return
    }

    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl
    }

    setLoading(true)
    try {
      const data = await auditLandingPage(normalizedUrl)
      setResult(data)
      setProUnlocked(false)
    } catch {
      setError('Audit failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handlePurchaseAndRevealPro() {
    if (!result) return

    setError('')
    setProUnlocked(true)

    const paymentLink = getProPaymentLink()

    if (!paymentLink) {
      setError('Stripe checkout is not configured yet. Please contact support.')
      return
    }

    const paymentTab = window.open(paymentLink, '_blank', 'noopener,noreferrer')

    if (!paymentTab) {
      setError('Pro report is now visible below. Please allow pop-ups and click again to complete payment in Stripe.')
    }
  }

  function scoreColor(score) {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 50) return 'text-amber-400'
    return 'text-red-400'
  }

  function scoreLabel(score) {
    if (score >= 80) return 'Great'
    if (score >= 50) return 'Needs Work'
    return 'Poor'
  }

  function severityBadge(severity) {
    const colors = {
      critical: { bg: 'rgba(239,68,68,0.15)', text: '#f87171', dot: 'bg-red-400' },
      major: { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24', dot: 'bg-amber-400' },
      minor: { bg: 'rgba(96,165,250,0.15)', text: '#60a5fa', dot: 'bg-blue-400' },
    }

    const c = colors[severity] || colors.minor

    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: c.bg, color: c.text }}>
        <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
        {severity}
      </span>
    )
  }

  const tweetText = result
    ? buildTweetText({ score: result.score, issues: result.summary })
    : ''

  const tweetIntentUrl = tweetText
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
    : ''

  function handleShareOnX() {
    if (!tweetIntentUrl) return
    window.open(tweetIntentUrl, '_blank', 'noopener,noreferrer')
  }

  async function handleCopyShareText() {
    if (!tweetText) return

    try {
      await navigator.clipboard.writeText(tweetText)
      setShareMessage('Copied! Paste it on X to share your score.')
    } catch {
      setShareMessage('Could not copy automatically. You can still share on X directly.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <section className="relative overflow-hidden px-6 pt-32 pb-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            AI-powered CRO feedback in about 60 seconds
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Instant CRO Audits.
            </span>
            <br />
            Higher Conversions.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Get an instant AI-powered audit of your landing page&apos;s copy, layout, UX, and trust
            signals. No consultants. No meetings. Just actionable feedback you can use on your next
            test.
          </p>

          <form onSubmit={handleFreeAudit} id="audit-form" className="mx-auto mt-10 flex max-w-lg flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yoursite.com/landing-page"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:shadow-emerald-500/40 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Auditing...
                </>
              ) : (
                'Audit Your Page — Free'
              )}
            </button>
          </form>
          <p className="mt-3 text-sm text-gray-500">
            No credit card required for the free audit. Upgrade to Pro for a one-time $10.
          </p>
          <p className="mt-2 text-xs text-gray-600">
            We analyze the page you submit only. No analytics, ad account, or CMS access required.
          </p>
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </div>
      </section>

      {result && (
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <div className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-500">
                Conversion Score
              </div>
              <div className={`text-7xl font-bold ${scoreColor(result.score)}`}>
                {result.score}
                <span className="text-3xl text-gray-600">/100</span>
              </div>
              <div className={`mt-2 text-lg font-semibold ${scoreColor(result.score)}`}>
                {scoreLabel(result.score)}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleShareOnX}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-5 py-2 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/30"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.26l-4.9-6.4L6.45 22H3.34l7.24-8.27L.8 2h6.42l4.43 5.85L18.9 2Zm-1.1 18.1h1.73L6.3 3.8H4.45l13.35 16.3Z" />
                  </svg>
                  Share on X
                </button>

                <button
                  onClick={handleCopyShareText}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm text-white/80 transition hover:bg-white/20"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2m-6 4H6a2 2 0 01-2-2v-8a2 2 0 012-2h8a2 2 0 012 2v2" />
                  </svg>
                  Copy post text
                </button>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                One click to post your score and bring other founders back to AuditFast.
              </p>
              {shareMessage && <p className="mt-2 text-xs text-emerald-400">{shareMessage}</p>}
            </div>

            <div className="mb-6">
              <h2 className="mb-6 text-2xl font-bold text-white">Key Issues Found</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {result.summary.map((issue, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div
                      className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor:
                          issue.severity === 'critical'
                            ? 'rgba(239,68,68,0.15)'
                            : issue.severity === 'major'
                              ? 'rgba(251,191,36,0.15)'
                              : 'rgba(96,165,250,0.15)',
                        color:
                          issue.severity === 'critical'
                            ? '#f87171'
                            : issue.severity === 'major'
                              ? '#fbbf24'
                              : '#60a5fa',
                      }}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          issue.severity === 'critical'
                            ? 'bg-red-400'
                            : issue.severity === 'major'
                              ? 'bg-amber-400'
                              : 'bg-blue-400'
                        }`}
                      />
                      {issue.severity}
                    </div>
                    <h3 className="mb-1 font-semibold text-white">{issue.title}</h3>
                    <p className="text-sm text-gray-400">{issue.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-8 text-center">
              <h2 className="text-2xl font-bold text-white">Get the Full Pro Audit</h2>
              <p className="mt-2 text-gray-400">
                Unlock specific copy rewrites, UX wireframe suggestions, and a prioritized action plan.
              </p>
              <ul className="mx-auto mt-4 flex max-w-md flex-col gap-2 text-left text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 flex-shrink-0 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  3 specific copy rewrites
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 flex-shrink-0 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                UX wireframe improvement suggestions
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 flex-shrink-0 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Prioritized action plan by impact
                </li>
              </ul>
              <p className="mt-4 text-xs text-gray-500">
                One-time payment. No subscription. If the paid report fails to generate correctly, we will fix it or refund it.
              </p>
              <button
                onClick={handlePurchaseAndRevealPro}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:shadow-emerald-500/40"
              >
                {proUnlocked ? 'Open Stripe Checkout Again — $10' : 'Purchase — $10 & Reveal Pro Report'}
              </button>
              <p className="mt-3 text-xs text-gray-500">
                Clicking purchase opens Stripe in a new tab and immediately shows your Pro report below.
              </p>
            </div>

            {proUnlocked && (
              <div className="mt-8 space-y-8">
                <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Pro audit unlocked</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Your full report is ready</h2>
                  <p className="mt-2 text-sm text-gray-300">
                    You can review all Pro recommendations right now. Stripe checkout opened in a new tab so you can complete payment without losing this report.
                  </p>
                </div>

                <div>
                  <h2 className="mb-5 text-2xl font-bold text-white">All Pro Issues ({result.pro?.length || 0})</h2>
                  <div className="space-y-4">
                    {(result.pro || []).map((issue, i) => (
                      <div key={`${issue.title}-${i}`} className="rounded-xl border border-white/10 bg-white/5 p-5">
                        <div className="mb-2 flex items-center gap-2">
                          {severityBadge(issue.severity)}
                          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-gray-400">{issue.type}</span>
                        </div>
                        <h3 className="mb-1 font-semibold text-white">{issue.title}</h3>
                        <p className="mb-3 text-sm text-gray-400">{issue.description}</p>
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">Suggestion</span>
                          <p className="mt-1 text-sm text-emerald-300">{issue.suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {(result.rewrites || []).length > 0 && (
                  <div>
                    <h2 className="mb-5 text-2xl font-bold text-white">Copy Rewrites</h2>
                    <div className="space-y-4">
                      {result.rewrites.map((rw, i) => (
                        <div key={`rewrite-${i}`} className="rounded-xl border border-white/10 bg-white/5 p-5">
                          <div className="mb-2 flex items-center justify-between">
                            <h3 className="font-semibold text-white">Rewrite #{i + 1}</h3>
                            <span className="text-xs font-medium text-emerald-400">{rw.expectedImpact}</span>
                          </div>
                          <div className="mb-3">
                            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Problem</span>
                            <p className="mt-1 text-sm text-gray-400">{rw.problem}</p>
                          </div>
                          <div className="mb-3">
                            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Original</span>
                            <p className="mt-1 text-sm text-gray-400 line-through">{rw.original}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">Suggested Rewrite</span>
                            <p className="mt-1 text-sm text-emerald-300">{rw.rewrite}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(result.suggestions || []).length > 0 && (
                  <div>
                    <h2 className="mb-5 text-2xl font-bold text-white">UX & Layout Improvements</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {result.suggestions.map((sug, i) => (
                        <div key={`suggestion-${i}`} className="rounded-xl border border-white/10 bg-white/5 p-5">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-gray-400">{sug.area}</span>
                            <span className={`text-xs font-medium ${
                              sug.impact === 'High' ? 'text-red-400' : sug.impact === 'Medium' ? 'text-amber-400' : 'text-blue-400'
                            }`}>{sug.impact} Impact</span>
                          </div>
                          <h3 className="mb-1 font-semibold text-white">{sug.title}</h3>
                          <p className="mb-3 text-sm text-gray-400">{sug.currentState}</p>
                          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                            <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">Recommendation</span>
                            <p className="mt-1 text-sm text-emerald-300">{sug.suggestion}</p>
                            <div className="mt-2 text-[10px] uppercase tracking-widest text-emerald-500/50">{sug.beforeAfter}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.actionPlan && (
                  <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-8">
                    <h2 className="text-2xl font-bold text-white">Prioritized Action Plan</h2>
                    <p className="mt-2 text-sm text-gray-300">Fix these in order for the fastest conversion lift.</p>

                    <div className="mt-6 grid gap-8 md:grid-cols-3 text-left">
                      <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-red-400">1. Quick Wins (Critical)</h3>
                        <div className="space-y-2">
                          {(result.actionPlan.quickWins || []).map((item, i) => (
                            <div key={`quick-${i}`} className="rounded-lg border border-white/5 bg-black/20 p-3 text-sm">
                              <div className="font-medium text-white">{item.title}</div>
                              <div className="mt-1 text-xs uppercase text-gray-500">{item.dimension}</div>
                            </div>
                          ))}
                          {(result.actionPlan.quickWins || []).length === 0 && <p className="text-xs italic text-gray-500">No critical issues found.</p>}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-400">2. Strategic Fixes (Major)</h3>
                        <div className="space-y-2">
                          {(result.actionPlan.strategic || []).map((item, i) => (
                            <div key={`strategic-${i}`} className="rounded-lg border border-white/5 bg-black/20 p-3 text-sm">
                              <div className="font-medium text-white">{item.title}</div>
                              <div className="mt-1 text-xs uppercase text-gray-500">{item.dimension}</div>
                            </div>
                          ))}
                          {(result.actionPlan.strategic || []).length === 0 && <p className="text-xs italic text-gray-500">No major issues found.</p>}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-400">3. Long-term (Minor)</h3>
                        <div className="space-y-2">
                          {(result.actionPlan.longTerm || []).map((item, i) => (
                            <div key={`long-${i}`} className="rounded-lg border border-white/5 bg-black/20 p-3 text-sm">
                              <div className="font-medium text-white">{item.title}</div>
                              <div className="mt-1 text-xs uppercase text-gray-500">{item.dimension}</div>
                            </div>
                          ))}
                          {(result.actionPlan.longTerm || []).length === 0 && <p className="text-xs italic text-gray-500">No minor issues found.</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {!result && (
        <section className="border-t border-white/10 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-white">Why AuditFast?</h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">60-Second Audit</h3>
                <p className="text-sm text-gray-400">Paste your URL and get a structured CRO readout quickly, without booking calls or waiting on a consultant.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Grounded in CRO heuristics</h3>
                <p className="text-sm text-gray-400">The audit checks common conversion friction across messaging clarity, layout, UX, trust signals, and CTA strength.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">$10 Pro Report</h3>
                <p className="text-sm text-gray-400">Unlock rewrites, UX suggestions, and a prioritized action plan with a one-time payment instead of another monthly tool.</p>
              </div>
            </div>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Fix what matters first</h3>
                <p className="text-sm text-gray-400">Every recommendation is designed to help you prioritize likely high-impact changes instead of guessing what to test next.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Built for founders</h3>
                <p className="text-sm text-gray-400">Made for indie hackers, bootstrappers, and small SaaS teams that want a fast outside perspective before the next experiment.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-white/10 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400/80">Before you buy</p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Clear expectations build trust</h2>
            <p className="mt-4 text-base text-gray-400 sm:text-lg">
              The fastest way to lose a buyer is vague policy copy. Here&apos;s the plain-English version of what AuditFast does, what it uses, and what happens if a paid report breaks.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {trustCards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className={`mb-4 h-1 w-16 rounded-full bg-gradient-to-r ${card.accent}`} />
                <h3 className="mb-3 text-lg font-semibold text-white">{card.title}</h3>
                <p className="text-sm leading-6 text-gray-400">{card.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h3 className="text-2xl font-semibold text-white">Frequently asked questions</h3>
                <div className="mt-6 space-y-4">
                  {faqs.map((item) => (
                    <div key={item.question} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                      <h4 className="text-base font-semibold text-white">{item.question}</h4>
                      <p className="mt-2 text-sm leading-6 text-gray-400">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-6">
                <h3 className="text-xl font-semibold text-white">Quick trust notes</h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-300">
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
                    <span>Free audit first. Pay only if you want the deeper report.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
                    <span>Use it to prioritize tests faster, not as a promise of guaranteed conversion gains.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
                    <span>Please only submit public pages you are allowed to share. Avoid confidential staging or client pages.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
                    <span>When live payments are enabled, checkout is processed securely through Stripe.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
