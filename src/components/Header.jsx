import { Link } from 'react-router-dom'

export default function Header() {
  const supportEmail = 'auditfast-2a99939f@ctomail.io'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 text-sm font-bold text-gray-950">
            AF
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            AuditFast
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <a
            href={`mailto:${supportEmail}`}
            className="hidden text-sm font-medium text-gray-400 transition hover:text-white sm:block"
          >
            Support
          </a>
          <a
            href="#audit-form"
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/20"
          >
            Get Free Audit
          </a>
        </div>
      </div>
    </header>
  )
}
