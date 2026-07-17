import express from 'express'
import cors from 'cors'
// Managed Stripe Payment Links are handled client-side (no server-side Stripe SDK needed).
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Serve static frontend build
app.use(express.static(path.join(__dirname, 'dist')))

// Payments are handled via a managed Stripe Payment Link in the frontend.
// Keep API surface minimal while serving the app.
app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

// Fallback to index.html for SPA routing — catch-all for unmatched routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AuditFast server running on http://0.0.0.0:${PORT}`)
})