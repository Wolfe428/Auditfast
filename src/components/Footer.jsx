import { Link } from 'react-router-dom'

export default function Footer() {
  const supportEmail = 'auditfast-2a99939f@ctomail.io'

  return (
    <footer className="border-t border-white/10 bg-gray-950 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 text-sm font-bold text-gray-950">
                AF
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                AuditFast
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
              AuditFast helps indie hackers, solo founders, and small SaaS teams spot conversion issues faster. Instead of hiring a consultant for an early pass, you can get a structured audit and a prioritized list of fixes in minutes.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Support & Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li>
                <a href={`mailto:${supportEmail}`} className="transition hover:text-emerald-400">
                  {supportEmail}
                </a>
              </li>
              <li>
                <p>Response within 2 business days</p>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Trust & Privacy</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li>
                <p className="text-xs leading-5">
                  We only use the URL you submit and the page content needed to generate your audit. 
                  Payments are handled securely by Stripe. We do not sell your data.
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-gray-500">
            © 2026 AuditFast. Built for founders who want better conversions.
          </p>
          <div className="flex gap-6">
            <Link to="/terms" className="text-xs text-gray-500 transition hover:text-white">Terms</Link>
            <Link to="/privacy" className="text-xs text-gray-500 transition hover:text-white">Privacy</Link>
            <Link to="/refund-policy" className="text-xs text-gray-500 transition hover:text-white">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
