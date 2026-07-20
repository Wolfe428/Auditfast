import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import ReportPage from './pages/ReportPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import RefundPolicyPage from './pages/RefundPolicyPage.jsx'
import BlogCROChecklist from './pages/BlogCROChecklist.jsx'
import BlogCROForFounders from './pages/BlogCROForFounders.jsx'
import BlogCROHeuristicsGuide from './pages/BlogCROHeuristicsGuide.jsx'
import BlogConversionKillers from './pages/BlogConversionKillers.jsx'
import BlogHeadlineFormulas from './pages/BlogHeadlineFormulas.jsx'
import BlogAuditFastVsCrazyEgg from './pages/BlogAuditFastVsCrazyEgg.jsx'
import BlogIndexPage from './pages/BlogIndexPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/blog" element={<BlogIndexPage />} />
      <Route path="/report/:id" element={<ReportPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/refund-policy" element={<RefundPolicyPage />} />
      <Route path="/blog/cro-checklist" element={<BlogCROChecklist />} />
      <Route path="/blog/cro-for-founders" element={<BlogCROForFounders />} />
      <Route path="/blog/cro-heuristics-guide" element={<BlogCROHeuristicsGuide />} />
      <Route path="/blog/10-common-conversion-killers" element={<BlogConversionKillers />} />
      <Route path="/blog/headline-formulas-that-convert" element={<BlogHeadlineFormulas />} />
      <Route path="/blog/auditfast-vs-crazyegg" element={<BlogAuditFastVsCrazyEgg />} />
    </Routes>
  )
}
