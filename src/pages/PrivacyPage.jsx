import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import SEOHead from '../components/SEOHead.jsx'

export default function PrivacyPage() {
  return (
    <>
      <SEOHead
        title="Privacy Policy | AuditFast"
        description="Read how AuditFast handles URLs, audit content, payments, and privacy protections."
        path="/privacy"
        keywords={['AuditFast privacy policy', 'CRO audit privacy']}
      />
      <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      <main className="flex-grow px-6 pt-32 pb-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          <div className="prose prose-invert prose-emerald max-w-none text-gray-400 space-y-6">
            <p>
              At AuditFast, we respect your privacy and are committed to protecting it. This policy explains how we handle your data.
            </p>
            
            <h2 className="text-xl font-semibold text-white">1. Data We Collect</h2>
            <p>
              We only collect the URL you submit and the visible page content needed to generate your CRO audit. We do not ask for, or store, your analytics logins, CMS access, or server credentials.
            </p>

            <h2 className="text-xl font-semibold text-white">2. Payment Information</h2>
            <p>
              Payment processing is handled securely by Stripe. We do not see or store your credit card details on our servers. Stripe's use of your personal information is governed by their Privacy Policy.
            </p>

            <h2 className="text-xl font-semibold text-white">3. How We Use Your Data</h2>
            <p>
              The submitted URLs and page content are used exclusively to perform the AI-powered audit. We do not sell your submitted URLs or report data to third parties.
            </p>

            <h2 className="text-xl font-semibold text-white">4. Cookies</h2>
            <p>
              We use minimal cookies for essential site functionality and to manage your session. We do not use deceptive tracking or third-party advertising cookies.
            </p>

            <h2 className="text-xl font-semibold text-white">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at auditfast-2a99939f@ctomail.io.
            </p>
          </div>
        </div>
      </main>
      <Footer />
      </div>
    </>
  )
}
