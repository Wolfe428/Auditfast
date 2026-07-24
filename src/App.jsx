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
import BlogFreeCROAuditTool from './pages/FreeCROAuditTool.jsx'
import BlogBestCROAuditTools2026 from './pages/BestCROAuditTools2026.jsx'
import BlogLandingPageAuditChecklist2026 from './pages/LandingPageAuditChecklist2026.jsx'
import BlogImproveLandingConversion from './pages/ImproveLandingConversion.jsx'
import BlogAuditFastVsHotjar from './pages/AuditFastVsHotjar.jsx'
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
      <Route path="/blog/free-cro-audit-tool" element={<BlogFreeCROAuditTool />} />
      <Route path="/blog/best-cro-audit-tools-2026" element={<BlogBestCROAuditTools2026 />} />
      <Route path="/blog/landing-page-audit-checklist-2026" element={<BlogLandingPageAuditChecklist2026 />} />
      <Route path="/blog/improve-landing-page-conversion-rate" element={<BlogImproveLandingConversion />} />
      <Route path="/blog/auditfast-vs-hotjar" element={<BlogAuditFastVsHotjar />} />
      <Route path="/blog/headline-formulas-that-convert" element={<BlogHeadlineFormulas />} />
      <Route path="/blog/auditfast-vs-crazyegg" element={<BlogAuditFastVsCrazyEgg />} />
    </Routes>
  )
}
