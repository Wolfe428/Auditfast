import './score-card.css'

function scoreColor(score) {
  if (score >= 80) return '#00C48C'
  if (score >= 50) return '#FFB347'
  return '#FF6B6B'
}

function scoreLabel(score) {
  if (score >= 80) return 'Great'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Needs Work'
  return 'Critical'
}

function ScoreRing({ score = 0, size = 160 }) {
  const radius = 68
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = scoreColor(score)

  return (
    <div className="sc-score-ring-wrapper" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="10"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 80 80)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="sc-score-value">
        <span className="sc-score-number" style={{ color }}>{score}</span>
        <span className="sc-score-label">/100</span>
      </div>
    </div>
  )
}

export default function ScoreCard({
  score = 0,
  auditedUrl = '',
  issues = [],
  userName = '',
  showCta = true,
  ctaText = 'Get your free audit at auditfast.dev',
}) {
  const color = scoreColor(score)
  const label = scoreLabel(score)
  const topIssues = issues.slice(0, 3)

  return (
    <div className="score-card" style={{ '--score-color': color }}>
      <div className="sc-bg-overlay" />

      <div className="sc-content">
        <div className="sc-header">
          <div className="sc-brand">
            <div className="sc-logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="6" fill="#00C48C" />
                <path d="M8 18L14 8L20 18H8Z" fill="white" opacity="0.9" />
                <circle cx="14" cy="17" r="3" fill="white" opacity="0.9" />
              </svg>
            </div>
            <div className="sc-brand-text">
              <span className="sc-brand-name">AuditFast</span>
              <span className="sc-brand-tag">Instant CRO Audits</span>
            </div>
          </div>
          <div className="sc-score-label-badge" style={{ background: color }}>
            {label}
          </div>
        </div>

        <div className="sc-main">
          <ScoreRing score={score} />

          <div className="sc-url-section">
            <div className="sc-url-label">AUDITED PAGE</div>
            <div className="sc-url">{auditedUrl || 'your-landing-page.com'}</div>
          </div>
        </div>

        {topIssues.length > 0 && (
          <div className="sc-issues">
            <div className="sc-issues-title">Top Issues Found</div>
            <div className="sc-issues-list">
              {topIssues.map((issue, i) => (
                <div key={`${issue}-${i}`} className="sc-issue-item">
                  <span className="sc-issue-number" style={{ background: color }}>
                    {i + 1}
                  </span>
                  <span className="sc-issue-text">{issue}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showCta && (
          <div className="sc-footer">
            <span className="sc-cta-arrow">→</span>
            <span className="sc-cta-text">{ctaText}</span>
          </div>
        )}

        {userName && <div className="sc-user-attribution">Audit by {userName}</div>}
      </div>
    </div>
  )
}
