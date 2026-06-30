import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import ReportPage from './pages/ReportPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import RefundPolicyPage from './pages/RefundPolicyPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/report/:id" element={<ReportPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/refund-policy" element={<RefundPolicyPage />} />
    </Routes>
  )
}
