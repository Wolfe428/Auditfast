import { useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { auditLandingPage } from '../services/auditApi.js'

export default function ReportPage() {
  const location = useLocation()
  const [auditData, setAuditData] = useState(location.state?.audit || null)
  const [loading, setLoading] = useState(!auditData)

  useEffect(() => {
    if (!auditData) {
      // If no data passed, run a sample audit
      auditLandingPage('https://example.com').then(data => {
        setAuditData(data)
        setLoading(false)
      })
    }
  }, [auditData])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="flex items-center justify-center pt-40">
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 animate-spin text-emerald-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="mt-4 text-gray-400">Loading audit report...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!auditData) return null

  const { score, pro, rewrites, suggestions, actionPlan, url } = auditData

  function scoreColor(s) {
    if (s >= 70) return 'text-emerald-400'
    if (s >= 40) return 'text-amber-400'
    return 'text-red-400'
  }

  function severityBadge(severity) {
    const colors = {
      critical: { bg: 'rgba(239,68,68,0.15)', text: '#f87171', dot: 'bg-red-400' },
      major: { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24', dot: 'bg-amber-400' },
      minor: { bg: 'rgba(96,165,250,0.15)', text: '#60a5fa', dot: 'bg-blue-400' }
    }
    const c = colors[severity] || colors.minor
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: c.bg, color: c.text }}>
        <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
        {severity}
      </span>
    )
  }


  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <div className="px-6 pt-28 pb-20">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-500">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Pro Audit Report</span>
          </div>

          {/* Score Header */}
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <h1 className="text-2xl font-bold text-white">Pro Audit Report</h1>
                <p className="mt-1 text-sm text-gray-400">Landing page: <span className="text-white">{url}</span></p>
              </div>
              <div className="text-center">
                <div className={`text-5xl font-bold ${scoreColor(score)}`}>{score}<span className="text-xl text-gray-600">/100</span></div>
                <div className={`text-sm font-semibold ${scoreColor(score)}`}>
                  {score >= 70 ? 'Great' : score >= 40 ? 'Needs Work' : 'Poor'}
                </div>
              </div>
            </div>
          </div>

          {/* All Issues */}
          <div className="mb-8">
            <h2 className="mb-6 text-xl font-bold text-white">All Issues ({pro.length})</h2>
            <div className="space-y-4">
              {pro.map((issue, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    {severityBadge(issue.severity)}
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-gray-400">{issue.type}</span>
                  </div>
                  <h3 className="mb-1 font-semibold text-white">{issue.title}</h3>
                  <p className="mb-2 text-sm text-gray-400">{issue.description}</p>
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">Suggestion</span>
                    <p className="mt-1 text-sm text-emerald-300">{issue.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Copy Rewrites */}
          {rewrites && rewrites.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-6 text-xl font-bold text-white">Copy Rewrites</h2>
              <div className="space-y-4">
                {rewrites.map((rw, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5">
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

          {/* UX Suggestions */}
          {suggestions && suggestions.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-6 text-xl font-bold text-white">UX & Layout Improvements</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {suggestions.map((sug, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5">
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

          {/* Action Plan */}
          {actionPlan && (
            <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-8">
              <h2 className="text-xl font-bold text-white">Prioritized Action Plan</h2>
              <p className="mt-2 text-sm text-gray-400">
                Fix these in order of impact to see the fastest conversion lift.
              </p>
              
              <div className="mt-8 grid gap-8 md:grid-cols-3 text-left">
                <div>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-red-400">1. Quick Wins (Critical)</h3>
                  <div className="space-y-2">
                    {actionPlan.quickWins.map((item, i) => (
                      <div key={i} className="rounded-lg bg-black/20 p-3 text-sm border border-white/5">
                        <div className="font-medium text-white">{item.title}</div>
                        <div className="mt-1 text-xs text-gray-500 uppercase">{item.dimension}</div>
                      </div>
                    ))}
                    {actionPlan.quickWins.length === 0 && <p className="text-xs text-gray-600 italic">No critical issues found.</p>}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-amber-400">2. Strategic Fixes (Major)</h3>
                  <div className="space-y-2">
                    {actionPlan.strategic.map((item, i) => (
                      <div key={i} className="rounded-lg bg-black/20 p-3 text-sm border border-white/5">
                        <div className="font-medium text-white">{item.title}</div>
                        <div className="mt-1 text-xs text-gray-500 uppercase">{item.dimension}</div>
                      </div>
                    ))}
                    {actionPlan.strategic.length === 0 && <p className="text-xs text-gray-600 italic">No major issues found.</p>}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-blue-400">3. Long-term (Minor)</h3>
                  <div className="space-y-2">
                    {actionPlan.longTerm.map((item, i) => (
                      <div key={i} className="rounded-lg bg-black/20 p-3 text-sm border border-white/5">
                        <div className="font-medium text-white">{item.title}</div>
                        <div className="mt-1 text-xs text-gray-500 uppercase">{item.dimension}</div>
                      </div>
                    ))}
                    {actionPlan.longTerm.length === 0 && <p className="text-xs text-gray-600 italic">No minor issues found.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
