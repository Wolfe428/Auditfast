import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import SEOHead from '../components/SEOHead.jsx'
import { auditLandingPage } from '../services/auditApi.js'
import { getProPaymentLink, hasManagedPaymentLink } from '../services/stripeConfig.js'

/* ── Color helpers based on score ── */
function scoreHex(score) {
  if (score >= 80) return '#00C48C'
  if (score >= 50) return '#FFB347'
  return '#FF6B6B'
}


function scoreBgClass(score) {
  if (score >= 80) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  if (score >= 50) return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  return 'bg-red-500/20 text-red-400 border-red-500/30'
}

function scoreLabel(score) {
  if (score >= 80) return { label: 'Great', desc: 'Minor optimization opportunities. Conversions are likely solid.' }
  if (score >= 60) return { label: 'Good', desc: 'A few issues worth fixing. Test the critical ones first.' }
  if (score >= 40) return { label: 'Needs Work', desc: 'Several issues impacting conversions. Prioritize critical fixes.' }
  return { label: 'Critical', desc: 'Major conversion blockers. Urgent overhaul recommended.' }
}

/* ── Score Ring SVG ── */
function ScoreRing({ score = 0, size = 140 }) {
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = scoreHex(score)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 140 140" className="-rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold leading-none tracking-tight" style={{ color }}>{score}</span>
        <span className="mt-0.5 text-xs font-medium text-gray-500">/100</span>
      </div>
    </div>
  )
}

/* ── Dimension Bar ── */
function DimensionBar({ label, score, maxScore = 100 }) {
  const pct = Math.min(100, Math.round((score / maxScore) * 100))
  const barColor = scoreHex(score)
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
      <span className="w-8 text-right text-xs font-semibold" style={{ color: barColor }}>{score}</span>
    </div>
  )
}

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

const DEFAULT_SHARE_URL = 'https://www.auditfastpro.com'

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
  const [showProModal, setShowProModal] = useState(false)
  const [shareMessage, setShareMessage] = useState('')
  const navigate = useNavigate()

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
    } catch {
      setError('Audit failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpgradeToPro() {
    setShowProModal(true)
  }

  async function handleProCheckout() {
    if (!result) return
    setShowProModal(false)

    const paymentLink = getProPaymentLink()

    if (paymentLink) {
      window.location.href = paymentLink
      return
    }

    // If the managed payment link is not configured yet, keep demo flow usable.
    if (!hasManagedPaymentLink()) {
      setError('Pro checkout is not configured yet. Ask support to enable the Stripe payment link.')
      navigate('/report/pro-sample', { state: { audit: result, paid: true } })
      return
    }

    setError('Unable to open hosted checkout. Please try again.')
  }

  const shareText = result
    ? buildTweetText({ score: result.score, issues: result.summary })
    : ''

  const tweetIntentUrl = shareText
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    : ''

  const linkedInUrl = shareText
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`
    : ''

  function handleShareOnX() {
    if (!tweetIntentUrl) return
    window.open(tweetIntentUrl, '_blank', 'noopener,noreferrer')
  }

  function handleShareOnLinkedIn() {
    if (!linkedInUrl) return
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer')
  }

  async function handleCopyShareText() {
    if (!shareText) return
    try {
      await navigator.clipboard.writeText(shareText)
      setShareMessage('Copied! Share it on X, LinkedIn, or anywhere you want.')
    } catch {
      setShareMessage('Could not copy automatically. Try selecting the text manually.')
    }
  }

  return (
    <>
      <SEOHead
        title="AuditFast — AI-Powered CRO Audits in 60 Seconds"
        description="Get instant, AI-powered Conversion Rate Optimization audits for your landing page. No consultant needed."
        path="/"
        keywords={['landing page audit', 'CRO audit', 'conversion rate optimization', 'SaaS conversions']}
      />
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
            {/* ═══ SCORE CARD — Visual Ring + Dimension Breakdown ═══ */}
            <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-6 sm:p-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
                {/* Score Ring */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <ScoreRing score={result.score} size={140} />
                  <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${scoreBgClass(result.score)}`}>
                    {scoreLabel(result.score).label}
                  </div>
                </div>

                {/* Dimension Breakdown */}
                <div className="flex-1 w-full space-y-3 pt-2">
                  <div className="text-xs font-semibold uppercase tracking-widest text-gray-500">Score Breakdown</div>
                  <DimensionBar label="Copy" score={result.subScores?.copy ?? result.score} />
                  <DimensionBar label="Layout" score={result.subScores?.layout ?? result.score} />
                  <DimensionBar label="UX" score={result.subScores?.ux ?? result.score} />
                  <DimensionBar label="Trust" score={result.subScores?.trust ?? result.score} />
                  <DimensionBar label="CTA" score={result.subScores?.cta ?? result.score} />
                </div>
              </div>

              <p className="mt-4 text-center text-sm text-gray-500 sm:text-left">
                {scoreLabel(result.score).desc}
              </p>
            </div>

            {/* ═══ KEY ISSUES FOUND ═══ */}
            <div className="mb-8">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white sm:text-2xl">Key Issues Found</h2>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-gray-400">
                  {result.summary.length} of {result.pro?.length ?? result.summary.length} total
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {result.summary.map((issue, i) => {
                  const severityColors = {
                    critical: { bg: 'rgba(239,68,68,0.12)', text: '#f87171', dot: 'bg-red-400', border: 'border-red-500/20' },
                    major: { bg: 'rgba(251,191,36,0.12)', text: '#fbbf24', dot: 'bg-amber-400', border: 'border-amber-500/20' },
                    minor: { bg: 'rgba(96,165,250,0.12)', text: '#60a5fa', dot: 'bg-blue-400', border: 'border-blue-500/20' },
                  }
                  const c = severityColors[issue.severity] || severityColors.minor
                  return (
                    <div key={i} className={`rounded-xl border ${c.border} p-5 transition hover:bg-white/[0.03]`} style={{ backgroundColor: c.bg }}>
                      <div className="mb-2 flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium`} style={{ backgroundColor: 'rgba(0,0,0,0.25)', color: c.text }}>
                          <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                          {issue.severity}
                        </span>
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-500">
                          {issue.type}
                        </span>
                      </div>
                      <h3 className="mb-1 font-semibold text-white text-sm">{issue.title}</h3>
                      <p className="text-xs leading-relaxed text-gray-400">{issue.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ═══ SHARE YOUR SCORE ═══ */}
            <div className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/5 via-white/[0.02] to-indigo-500/5 p-6 sm:p-8">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 text-2xl shadow-lg">
                  🚀
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-white">Share Your Score</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Help other founders discover AuditFast. Posting your score takes 5 seconds.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <button
                  onClick={handleShareOnX}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.26l-4.9-6.4L6.45 22H3.34l7.24-8.27L.8 2h6.42l4.43 5.85L18.9 2Zm-1.1 18.1h1.73L6.3 3.8H4.45l13.35 16.3Z" />
                  </svg>
                  Share on X
                </button>

                <button
                  onClick={handleShareOnLinkedIn}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 px-5 py-2.5 text-sm font-semibold text-blue-300 transition hover:bg-blue-600/30"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Share on LinkedIn
                </button>

                <button
                  onClick={handleCopyShareText}
                  className="inline-flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/10"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2m-6 4H6a2 2 0 01-2-2v-8a2 2 0 012-2h8a2 2 0 012 2v2" />
                  </svg>
                  Copy text
                </button>
              </div>

              {shareMessage && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-2 text-xs text-emerald-400">
                  <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {shareMessage}
                </div>
              )}
            </div>

            {/* ═══ PRO UPGRADE CTA ═══ */}
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-cyan-500/10 p-6 sm:p-8 text-center">
              <div className="mx-auto max-w-lg">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  🔓 Unlock full results
                </div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">Get the Pro Audit</h2>
                <p className="mt-2 text-sm text-gray-400">
                  Turn your {result.score}/100 score into a clear action plan with specific fixes you can ship today.
                </p>
              </div>

              <div className="mx-auto mt-6 grid max-w-lg gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-emerald-500/10 bg-black/20 p-4 text-left">
                  <div className="mb-1 text-lg">✍️</div>
                  <h4 className="text-sm font-semibold text-white">Copy Rewrites</h4>
                  <p className="mt-0.5 text-xs text-gray-500">3 specific before/after rewrites</p>
                </div>
                <div className="rounded-xl border border-emerald-500/10 bg-black/20 p-4 text-left">
                  <div className="mb-1 text-lg">🎨</div>
                  <h4 className="text-sm font-semibold text-white">UX Suggestions</h4>
                  <p className="mt-0.5 text-xs text-gray-500">Wireframe-level improvements</p>
                </div>
                <div className="rounded-xl border border-emerald-500/10 bg-black/20 p-4 text-left">
                  <div className="mb-1 text-lg">📋</div>
                  <h4 className="text-sm font-semibold text-white">Action Plan</h4>
                  <p className="mt-0.5 text-xs text-gray-500">Prioritized by impact</p>
                </div>
              </div>

              <button
                onClick={handleUpgradeToPro}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Unlock Pro Audit — $10
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <p className="mt-3 text-xs text-gray-500">
                One-time payment. No subscription. Fix or refund if the report fails.
              </p>
            </div>
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

      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white">Unlock Pro Audit</h2>
            <p className="mt-2 text-sm text-gray-400">
              Get the full report with copy rewrites, UX suggestions, and a prioritized action plan.
            </p>
            <div className="mt-6 rounded-xl bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Pro Audit</span>
                <span className="text-2xl font-bold text-white">$10</span>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  3 specific copy rewrites
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  UX improvement suggestions
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  One-time payment — no subscription
                </li>
              </ul>
            </div>
            <p className="mt-4 text-xs leading-5 text-gray-500">
              If your paid report does not generate correctly, we will fix it or refund it.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowProModal(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleProCheckout}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:shadow-emerald-500/40"
              >
                Purchase — $10
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}
