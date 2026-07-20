import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import SEOHead from '../components/SEOHead.jsx'

export default function RefundPolicyPage() {
  return (
    <>
      <SEOHead
        title="Refund Policy | AuditFast"
        description="Understand AuditFast refund eligibility, request windows, and processing for Pro Audits."
        path="/refund-policy"
        keywords={['AuditFast refund policy', 'CRO audit refund']}
      />
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Header />
        <main className="flex-grow px-6 pt-32 pb-20">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold text-white mb-8">Refund Policy</h1>
            <div className="prose prose-invert prose-emerald max-w-none text-gray-400 space-y-6">
              <p>
                We want you to be satisfied with your experience at AuditFast. This policy outlines our refund practices for Pro Audits.
              </p>

              <h2 className="text-xl font-semibold text-white">1. Instant Delivery</h2>
              <p>
                Because Pro Audit reports are generated and delivered instantly upon payment, we generally cannot offer refunds once a report has been successfully generated and made available to you.
              </p>

              <h2 className="text-xl font-semibold text-white">2. Eligibility for Refunds</h2>
              <p>
                You may be eligible for a refund if:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The payment was processed but the report failed to generate.</li>
                <li>The delivered report was blank or clearly broken due to a technical error on our side.</li>
                <li>You were charged multiple times for the same audit due to a billing error.</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">3. Refund Request Window</h2>
              <p>
                Refund requests must be submitted within 7 days of the purchase date.
              </p>

              <h2 className="text-xl font-semibold text-white">4. How to Request a Refund</h2>
              <p>
                To request a refund, please email us at auditfast-2a99939f@ctomail.io with your receipt or payment confirmation and a brief description of the issue.
              </p>

              <h2 className="text-xl font-semibold text-white">5. Processing</h2>
              <p>
                Approved refunds will be processed via Stripe to your original payment method. Please allow 5-10 business days for the credit to appear on your statement.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
