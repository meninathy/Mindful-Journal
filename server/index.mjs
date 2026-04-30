import express from 'express'
import Groq from 'groq-sdk'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

try {
  const envContent = readFileSync(resolve(__dirname, '../.env'), 'utf8')
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

const ANALYSIS_PROMPT = `You are a CBT-informed journaling assistant. Analyze the journal entry for emotional content.

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

const MIRROR_PROMPT = `You are a warm, non-judgmental journaling companion trained in reflective listening.
Generate exactly ONE open-ended reflective question to help the writer explore their thoughts with curiosity and self-compassion.

Rules:
- Do NOT diagnose, prescribe, fix, or give advice
- Do NOT use "should" or "you need to"
- Use curious, gentle language ("What might...", "How does it feel...", "What would it look like...")
- One sentence only, specific to this entry
- Respond with ONLY the question, no preamble`

app.post('/api/analyze-entry', async (req, res) => {
  const { content } = req.body
  if (!content) return res.status(400).json({ error: 'content is required' })

  if (!process.env.GROQ_API_KEY) {
    return res.json({
      sentiment: 'Balanced',
      distortions: [],
      mirror_prompt: 'What feels most alive or meaningful to you in what you just wrote?',
    })
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const [analysisRes, mirrorRes] = await Promise.all([
      groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: ANALYSIS_PROMPT },
          { role: 'user', content: `Journal entry:\n\n${content}` },
        ],
        max_tokens: 512,
        temperature: 0.3,
      }),
      groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: MIRROR_PROMPT },
          { role: 'user', content: `Journal entry:\n\n${content}` },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    ])

    let sentiment = 'Balanced'
    let distortions = []
    const analysisText = analysisRes.choices[0].message.content ?? ''
    try {
      const match = analysisText.match(/\{[\s\S]*\}/)
      if (match) {
        const parsed = JSON.parse(match[0])
        sentiment = parsed.sentiment ?? 'Balanced'
        distortions = Array.isArray(parsed.distortions) ? parsed.distortions : []
      }
    } catch {}

    const mirror_prompt = (mirrorRes.choices[0].message.content ?? '').trim()

    res.json({ sentiment, distortions, mirror_prompt })
  } catch (err) {
    console.error('Groq error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => console.log('🤖 AI server running on http://localhost:3001'))
