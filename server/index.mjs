import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'process'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env manually (no dotenv dep needed)
try {
  const envPath = resolve(__dirname, '../.env')
  const envContent = readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=')
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim()
  })
} catch {}

const app = express()
app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Headers', 'content-type')
  next()
})

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const ANALYSIS_SYSTEM = `You are a CBT-informed journaling assistant. Analyze the journal entry for emotional content.

Return ONLY valid JSON in this exact format:
{
  "sentiment": "Positive" | "Balanced" | "High-Distress",
  "distortions": [
    { "type": "Should Statements" | "Catastrophizing" | "All-or-Nothing Thinking", "phrase": "exact quote from text" }
  ]
}

Definitions:
- Positive: hope, gratitude, accomplishment, or general wellbeing
- Balanced: neutral or mixed emotional tone
- High-Distress: significant negative emotion, crisis thinking, overwhelming feelings
- Should Statements: rigid self-rules using "should", "must", "have to", "ought to"
- Catastrophizing: exaggerating negative outcomes, worst-case thinking
- All-or-Nothing Thinking: absolute terms like "always", "never", "completely", "total failure"

Only include distortions with a clear supporting phrase from the text. Return [] if none found.`

const MIRROR_SYSTEM = `You are a warm, non-judgmental journaling companion trained in reflective listening.
Generate exactly ONE open-ended reflective question to help the writer explore their thoughts with curiosity and self-compassion.

Rules:
- Do NOT diagnose, prescribe, fix, or give advice
- Do NOT use "should" or "you need to"
- Use curious, gentle language ("What might...", "How does it feel...", "What would it look like...")
- One sentence only
- Make it specific to the entry, not generic
- Respond with ONLY the question, no preamble`

app.post('/api/analyze-entry', async (req, res) => {
  const { content } = req.body
  if (!content) return res.status(400).json({ error: 'content is required' })

  if (!process.env.ANTHROPIC_API_KEY) {
    // Return mock data if no API key set
    return res.json({
      sentiment: 'Balanced',
      distortions: [],
      mirror_prompt: 'What feels most alive or meaningful to you in what you just wrote?',
    })
  }

  try {
    const [analysisRes, mirrorRes] = await Promise.all([
      anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: [{ type: 'text', text: ANALYSIS_SYSTEM, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: `Journal entry:\n\n${content}` }],
      }),
      anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        system: [{ type: 'text', text: MIRROR_SYSTEM, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: `Journal entry:\n\n${content}` }],
      }),
    ])

    let sentiment = 'Balanced'
    let distortions = []
    const analysisText = analysisRes.content[0].type === 'text' ? analysisRes.content[0].text : ''
    try {
      const match = analysisText.match(/\{[\s\S]*\}/)
      if (match) {
        const parsed = JSON.parse(match[0])
        sentiment = parsed.sentiment ?? 'Balanced'
        distortions = Array.isArray(parsed.distortions) ? parsed.distortions : []
      }
    } catch {}

    const mirror_prompt = mirrorRes.content[0].type === 'text' ? mirrorRes.content[0].text.trim() : ''

    res.json({ sentiment, distortions, mirror_prompt })
  } catch (err) {
    console.error('Analysis error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => console.log('🤖 AI server running on http://localhost:3001'))
