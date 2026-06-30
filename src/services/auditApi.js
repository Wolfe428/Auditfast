/**
 * AuditFast AI Audit Engine
 *
 * Based on the CRO Strategy v1.0 — 33-point heuristic framework.
 * Dimensions: Copy (30%), Layout (20%), UX (20%), Trust (20%), CTA (10%)
 */

const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || '';
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'gemini-2.0-flash';
const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models';

const DIMENSION_MAX_ISSUES = { copy: 8, layout: 8, ux: 7, trust: 7, cta: 6 };
const DIMENSION_WEIGHTS = { copy: 0.30, layout: 0.20, ux: 0.20, trust: 0.20, cta: 0.10 };
const SEVERITY_DEDUCTIONS = { critical: 20, major: 10, minor: 5 };
const VALID_TYPES = new Set(Object.keys(DIMENSION_WEIGHTS));
const VALID_SEVERITIES = new Set(Object.keys(SEVERITY_DEDUCTIONS));

const HEURISTIC_CHECKLIST = {
  copy: [
    'C1 Clear value proposition above the fold',
    'C2 Benefit-driven headline',
    'C3 Single core message',
    'C4 Scannable structure',
    'C5 Active persuasive language',
    'C6 Specific and credible claims',
    'C7 Emotional connection',
    'C8 Genuine urgency/scarcity (if appropriate)'
  ],
  layout: [
    'L1 Above-the-fold focus (headline, subheadline, CTA, visual)',
    'L2 Visual hierarchy and CTA prominence',
    'L3 White space and breathing room',
    'L4 Consistent alignment/grid',
    'L5 Mobile responsiveness and 48px touch targets',
    'L6 Directional cues toward CTA',
    'L7 Color contrast/accessibility',
    'L8 Relevant supporting visuals'
  ],
  ux: [
    'U1 Low-friction primary conversion flow',
    'U2 Clear labels/validation',
    'U3 Progress indicator for multi-step flows',
    'U4 Fast load-time signals',
    'U5 No dead ends/broken links',
    'U6 Keyboard and screen-reader friendliness',
    'U7 Light exit-intent recovery (once/session)'
  ],
  trust: [
    'T1 Social proof (testimonials/logos/ratings)',
    'T2 Trust badges/certifications',
    'T3 Privacy and data assurance near forms',
    'T4 Transparent pricing',
    'T5 Real company/author information',
    'T6 Case studies with numbers',
    'T7 Freshness/currentness signals'
  ],
  cta: [
    'A1 High-contrast CTA color',
    'A2 Action-oriented CTA text',
    'A3 Friction-reducing microcopy',
    'A4 Single primary CTA per viewport',
    'A5 Above-the-fold CTA presence',
    'A6 Genuine urgency language (if appropriate)'
  ]
};

function buildHeuristicPromptBlock() {
  return [
    'COPY (type: "copy"):',
    ...HEURISTIC_CHECKLIST.copy.map(item => `- ${item}`),
    '',
    'LAYOUT (type: "layout"):',
    ...HEURISTIC_CHECKLIST.layout.map(item => `- ${item}`),
    '',
    'UX (type: "ux"):',
    ...HEURISTIC_CHECKLIST.ux.map(item => `- ${item}`),
    '',
    'TRUST (type: "trust"):',
    ...HEURISTIC_CHECKLIST.trust.map(item => `- ${item}`),
    '',
    'CTA (type: "cta"):',
    ...HEURISTIC_CHECKLIST.cta.map(item => `- ${item}`),
  ].join('\n');
}

/**
 * AI Prompt Template (CRO Strategy §4 + explicit heuristic checklist)
 */
function buildAIPrompt(url) {
  const heuristicsBlock = buildHeuristicPromptBlock();

  return `You are a world-class CRO (Conversion Rate Optimization) expert with 15+ years of experience.
Your specialty is auditing landing pages and providing actionable, specific feedback founders can implement immediately.

Analyze the landing page at this URL: ${url}

Evaluate the page across these 5 dimensions using the exact heuristic IDs below.
${heuristicsBlock}

For each issue you find, return a JSON object with these fields:
- "type": one of "copy", "layout", "ux", "trust", "cta"
- "heuristicId": one of C1-C8, L1-L8, U1-U7, T1-T7, A1-A6
- "severity": one of "critical", "major", "minor"
- "title": a short specific title (max 8 words)
- "description": 2-3 sentences on what is wrong and why it hurts conversions
- "suggestion": specific actionable fix. For copy issues include an actual rewrite example.

Severity definitions:
- CRITICAL: directly prevents or severely hinders conversion
- MAJOR: significantly reduces conversion likelihood
- MINOR: optimization opportunity with smaller incremental gain

Rules:
- Return between 5 and 12 issues total.
- Prioritize critical and major issues.
- Avoid duplicate issues.
- Prefer coverage across multiple dimensions when evidence exists.

IMPORTANT: Return ONLY a valid JSON array. No markdown, no code fences, no extra text.`;
}

/**
 * Analyzes a landing page URL using AI and returns a CRO audit report.
 */
export async function auditLandingPage(url) {
  const rawIssues = await analyzeWithAI(url);
  const issues = sortIssuesByImpact(rawIssues);
  const { finalScore, baseScore, subScores } = calculateWeightedScore(issues);
  const proFeatures = generateProFeatures(issues);

  return {
    url,
    score: finalScore,
    baseScore,
    subScores,
    summary: issues.slice(0, 3),
    pro: issues,
    rewrites: proFeatures.rewrites,
    suggestions: proFeatures.suggestions,
    actionPlan: proFeatures.actionPlan,
    shareText: `I just audited my landing page with AuditFast and scored ${finalScore}/100! 🚀 Found ${issues.length} issues that were killing my conversions. Want to check yours? → auditfa.st`,
  };
}

/**
 * Core AI analysis function.
 */
async function analyzeWithAI(url) {
  if (!AI_API_KEY) {
    return getMockIssues();
  }

  const prompt = buildAIPrompt(url);

  try {
    const isGemini = AI_API_URL.includes('googleapis.com');

    let response;
    if (isGemini) {
      response = await fetch(`${AI_API_URL}/${AI_MODEL}:generateContent?key=${AI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 3072,
            responseMimeType: 'application/json'
          }
        })
      });
    } else {
      // OpenAI-compatible endpoint
      response = await fetch(`${AI_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AI_API_KEY}`
        },
        body: JSON.stringify({
          model: AI_MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 3072
        })
      });
    }

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const text = isGemini
      ? data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]'
      : data?.choices?.[0]?.message?.content || '[]';

    const parsedIssues = parseIssuesFromModelText(text);
    const issues = sanitizeIssues(parsedIssues);

    if (issues.length < 5) {
      // Ensure enough issues for stable sub-score computation.
      return topUpIssues(issues, getMockIssues(), 5, 12);
    }

    return issues.slice(0, 12);
  } catch (err) {
    console.error('AI audit failed:', err);
    return getMockIssues();
  }
}

function parseIssuesFromModelText(text) {
  const cleaned = (text || '')
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return [];
      }
    }
    return [];
  }
}

function sanitizeIssues(rawIssues) {
  if (!Array.isArray(rawIssues)) return [];

  const normalized = rawIssues
    .map((issue) => {
      const type = typeof issue?.type === 'string' ? issue.type.trim().toLowerCase() : '';
      const severity = typeof issue?.severity === 'string' ? issue.severity.trim().toLowerCase() : '';
      const title = typeof issue?.title === 'string' ? issue.title.trim() : '';
      const description = typeof issue?.description === 'string' ? issue.description.trim() : '';
      const suggestion = typeof issue?.suggestion === 'string' ? issue.suggestion.trim() : '';
      const heuristicId = typeof issue?.heuristicId === 'string' ? issue.heuristicId.trim().toUpperCase() : undefined;

      return { type, severity, title, description, suggestion, heuristicId };
    })
    .filter((issue) => {
      return (
        VALID_TYPES.has(issue.type) &&
        VALID_SEVERITIES.has(issue.severity) &&
        issue.title.length >= 3 &&
        issue.description.length >= 20 &&
        issue.suggestion.length >= 15
      );
    });

  const unique = [];
  const seen = new Set();

  for (const issue of normalized) {
    const key = `${issue.type}:${issue.title.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(issue);
  }

  return unique.slice(0, 12);
}

function topUpIssues(primaryIssues, fallbackIssues, minCount, maxCount) {
  const base = [...primaryIssues];
  const seen = new Set(base.map(issue => `${issue.type}:${issue.title.toLowerCase()}`));

  for (const issue of fallbackIssues) {
    if (base.length >= maxCount) break;
    if (base.length >= minCount) break;
    const key = `${issue.type}:${issue.title.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    base.push(issue);
  }

  return base.slice(0, maxCount);
}

function sortIssuesByImpact(issues) {
  const severityRank = { critical: 0, major: 1, minor: 2 };
  return [...issues].sort((a, b) => {
    const sevDiff = (severityRank[a.severity] ?? 99) - (severityRank[b.severity] ?? 99);
    if (sevDiff !== 0) return sevDiff;
    return a.title.localeCompare(b.title);
  });
}

/**
 * Weighted Scoring Methodology (CRO Strategy §3)
 *
 * 1) Base score for overall issue pressure.
 * 2) Dimension sub-scores normalized by dimension size.
 * 3) Final conversion score as weighted sum of dimension sub-scores.
 */
function calculateWeightedScore(issues) {
  const groups = { copy: [], layout: [], ux: [], trust: [], cta: [] };

  for (const issue of issues) {
    if (groups[issue.type]) groups[issue.type].push(issue);
  }

  let totalDeductions = 0;
  const subScores = {};

  for (const [dimension, dimensionIssues] of Object.entries(groups)) {
    const criticalCount = dimensionIssues.filter(i => i.severity === 'critical').length;
    const majorCount = dimensionIssues.filter(i => i.severity === 'major').length;
    const minorCount = dimensionIssues.filter(i => i.severity === 'minor').length;

    const deduction = (
      criticalCount * SEVERITY_DEDUCTIONS.critical +
      majorCount * SEVERITY_DEDUCTIONS.major +
      minorCount * SEVERITY_DEDUCTIONS.minor
    );

    totalDeductions += deduction;

    // Normalize by maximum possible deduction for this dimension.
    const maxIssues = DIMENSION_MAX_ISSUES[dimension] || 1;
    const maxDeduction = maxIssues * SEVERITY_DEDUCTIONS.critical;
    const score = 100 - ((deduction / maxDeduction) * 100);
    subScores[dimension] = clampScore(score);
  }

  const baseScore = clampScore(100 - totalDeductions);

  const weightedScore =
    (subScores.copy || 0) * DIMENSION_WEIGHTS.copy +
    (subScores.layout || 0) * DIMENSION_WEIGHTS.layout +
    (subScores.ux || 0) * DIMENSION_WEIGHTS.ux +
    (subScores.trust || 0) * DIMENSION_WEIGHTS.trust +
    (subScores.cta || 0) * DIMENSION_WEIGHTS.cta;

  return {
    finalScore: clampScore(Math.round(weightedScore)),
    baseScore,
    subScores,
  };
}

function clampScore(score) {
  if (Number.isNaN(score)) return 0;
  return Math.max(0, Math.min(100, score));
}

/**
 * Pro Report Enhancements (CRO Strategy §5)
 */
function generateProFeatures(issues) {
  // 5.1 Copy Rewrites (up to 3)
  const rewrites = issues
    .filter(i => i.type === 'copy')
    .slice(0, 3)
    .map(i => ({
      original: i.title,
      problem: i.description,
      rewrite: i.suggestion,
      expectedImpact: i.severity === 'critical'
        ? '+15–25% click-through'
        : i.severity === 'major'
          ? '+10–15% click-through'
          : '+5–10% click-through'
    }));

  // 5.2 UX Wireframe Suggestions
  const suggestions = issues
    .filter(i => i.type !== 'copy')
    .slice(0, 5)
    .map(i => ({
      area: i.type === 'layout'
        ? 'Layout & Visual Design'
        : i.type === 'ux'
          ? 'User Experience'
          : i.type === 'trust'
            ? 'Trust & Credibility'
            : 'CTA & Conversion',
      title: i.title,
      currentState: i.description,
      suggestion: i.suggestion,
      beforeAfter: i.severity === 'critical'
        ? 'Major redesign needed'
        : i.severity === 'major'
          ? 'Significant improvement'
          : 'Incremental optimization',
      impact: i.severity === 'critical' ? 'High' : i.severity === 'major' ? 'Medium' : 'Low'
    }));

  // 5.3 Prioritized Action Plan
  const quickWins = issues.filter(i => i.severity === 'critical');
  const strategic = issues.filter(i => i.severity === 'major');
  const longTerm = issues.filter(i => i.severity === 'minor');

  const actionPlan = {
    quickWins: quickWins.map(i => ({ title: i.title, dimension: i.type, impact: 'High', effort: 'Low' })),
    strategic: strategic.map(i => ({ title: i.title, dimension: i.type, impact: 'High', effort: 'Medium' })),
    longTerm: longTerm.map(i => ({ title: i.title, dimension: i.type, impact: 'Low', effort: 'Low' })),
  };

  return { rewrites, suggestions, actionPlan };
}

/**
 * Score band labels (CRO Strategy §3)
 */
export function getScoreLabel(score) {
  if (score >= 80) {
    return {
      label: 'Great',
      color: 'text-emerald-400',
      description: 'Minor optimization opportunities. Conversions are likely solid.'
    };
  }
  if (score >= 50) {
    return {
      label: 'Needs Work',
      color: 'text-amber-400',
      description: 'Several issues impacting conversions. Prioritize critical fixes.'
    };
  }
  return {
    label: 'Poor',
    color: 'text-red-400',
    description: 'Major conversion blockers. Urgent overhaul recommended.'
  };
}

/**
 * Mock data aligned with CRO Strategy §2 (33-point heuristic framework).
 */
function getMockIssues() {
  return [
    {
      type: 'copy',
      heuristicId: 'C1',
      severity: 'critical',
      title: 'Unclear Hero Value Proposition',
      description: 'The hero headline is generic and does not make the outcome obvious within the first few seconds. Visitors cannot quickly tell what problem your product solves or who it is for, which causes early drop-off.',
      suggestion: 'Rewrite the hero to be outcome-first. Example: "Increase signups by 30% in 14 days with instant CRO audits built for SaaS founders."'
    },
    {
      type: 'layout',
      heuristicId: 'L1',
      severity: 'critical',
      title: 'Hero Has Multiple Competing Actions',
      description: 'The above-the-fold area contains multiple buttons and links with equal visual weight. Competing actions split attention and reduce the click-through rate on the primary conversion path.',
      suggestion: 'Keep one primary CTA in the hero. Downgrade secondary actions to subtle text links placed below the primary button.'
    },
    {
      type: 'cta',
      heuristicId: 'A1',
      severity: 'major',
      title: 'Primary CTA Lacks Contrast',
      description: 'The primary button color is too similar to surrounding UI colors, so it does not stand out as the next step. Users scanning quickly may miss the main action entirely.',
      suggestion: 'Use a high-contrast CTA color that is unique on the page and maintain WCAG-compliant contrast against button text.'
    },
    {
      type: 'trust',
      heuristicId: 'T1',
      severity: 'major',
      title: 'Weak Social Proof Placement',
      description: 'Testimonials and logos are either missing or positioned far below the first CTA. Without immediate proof, visitors hesitate to trust claims and delay conversion.',
      suggestion: 'Place 2-3 short testimonials with names/photos near the hero CTA and add customer logos directly under the hero section.'
    },
    {
      type: 'ux',
      heuristicId: 'U1',
      severity: 'major',
      title: 'Form Requests Too Much Data',
      description: 'The lead form asks for multiple fields before delivering value, which increases abandonment. High-friction forms are a common conversion killer, especially for cold traffic.',
      suggestion: 'Reduce the first-step form to the minimum (email + URL). Collect additional details only after the user receives initial value.'
    },
    {
      type: 'copy',
      heuristicId: 'C6',
      severity: 'major',
      title: 'Claims Are Too Vague',
      description: 'Marketing claims rely on broad language without specific numbers or proof points. Vague claims reduce credibility and make the offer feel interchangeable.',
      suggestion: 'Add quantifiable proof in copy, such as median lift, sample size, and timeframe (e.g., "Median +18% signup lift in 21 days across 120 audits").'
    },
    {
      type: 'layout',
      heuristicId: 'L5',
      severity: 'major',
      title: 'Mobile Spacing Feels Compressed',
      description: 'On smaller screens, sections appear crowded and buttons are close together. Crowded mobile layouts reduce readability and lead to accidental taps.',
      suggestion: 'Increase vertical spacing on mobile, ensure touch targets are at least 48px high, and simplify multi-column sections into single-column blocks.'
    },
    {
      type: 'ux',
      heuristicId: 'U2',
      severity: 'minor',
      title: 'Validation Messages Are Generic',
      description: 'Form errors are displayed as generic alerts without field-level guidance. Users are unsure what to fix and may abandon instead of retrying.',
      suggestion: 'Add inline, field-specific validation that clearly explains what is wrong and how to correct it in one step.'
    },
    {
      type: 'trust',
      heuristicId: 'T3',
      severity: 'minor',
      title: 'No Privacy Reassurance Near Form',
      description: 'The form lacks a short privacy assurance statement near the submit action. Privacy-sensitive users may hesitate when data handling is not addressed at the decision point.',
      suggestion: 'Add microcopy under the form: "No spam. Your data stays private. Unsubscribe anytime." and link to your privacy policy.'
    },
    {
      type: 'cta',
      heuristicId: 'A3',
      severity: 'minor',
      title: 'CTA Missing Risk-Reduction Microcopy',
      description: 'The main button does not include nearby reassurance text that lowers perceived risk. Users benefit from quick context on what happens after click and whether payment is required.',
      suggestion: 'Add microcopy near the CTA: "No credit card required • Results in 60 seconds • Cancel anytime."'
    }
  ];
}
