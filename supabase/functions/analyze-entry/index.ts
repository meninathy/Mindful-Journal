import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.36.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! })

const ANALYSIS_SYSTEM_PROMPT = `You are a CBT-informed journaling assistant. Analyze the journal entry for emotional content.

Return ONLY valid JSON in this exact format:
{
  "sentiment": "Positive" | "Balanced" | "High-Distress",
  "distortions": [
    { "type": "Should Statements" | "Catastrophizing" | "All-or-Nothing Thinking", "phrase": "exact quote from text" }
  ]
}

Definitions:
- Positive: entry reflects hope, gratitude, accomplishment, or general wellbeing
- Balanced: neutral or mixed emotional tone, processing without extremes
- High-Distress: significant negative emotion, crisis thinking, overwhelming feelings
- Should Statements: rigid self-rules using "should", "must", "have to", "ought to"
- Catastrophizing: exaggerating negative outcomes, worst-case thinking
- All-or-Nothing Thinking: absolute terms like "always", "never", "completely", "total failure"

Only include distortions with a clear supporting phrase. Return [] for distortions if none detected.`

const MIRROR_SYSTEM_PROMPT = `You are a warm, non-judgmental journaling companion trained in reflective listening.
Generate exactly ONE open-ended reflective question to help the writer explore their thoughts with curiosity and self-compassion.

Rules:
- Do NOT diagnose, prescribe, fix, or give advice
- Do NOT use "should" or "you need to"
- Use curious, gentle language ("What might...", "How does it feel...", "What would it look like...")
- Keep it to one sentence
- Make it specific to the entry content, not generic
- Respond with ONLY the question, no preamble`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { entry_id, content } = await req.json()
    if (!entry_id || !content) {
      return new Response(JSON.stringify({ error: 'entry_id and content are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Prompt 1: Sentiment + Distortion Analysis (with prompt caching)
    const analysisResponse = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: [
        {
          type: 'text',
          text: ANALYSIS_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: `Journal entry:\n\n${content}` }],
    })

    let sentiment = 'Balanced'
    let distortions: Array<{ type: string; phrase: string }> = []

    const analysisText = analysisResponse.content[0].type === 'text' ? analysisResponse.content[0].text : ''
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        sentiment = parsed.sentiment ?? 'Balanced'
        distortions = Array.isArray(parsed.distortions) ? parsed.distortions : []
      }
    } catch {
      // Fallback to Balanced if parsing fails
    }

    // Prompt 2: Reflective Mirror (with prompt caching)
    const mirrorResponse = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: [
        {
          type: 'text',
          text: MIRROR_SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: `Journal entry:\n\n${content}` }],
    })

    const mirror_prompt = mirrorResponse.content[0].type === 'text' ? mirrorResponse.content[0].text.trim() : ''

    // Persist results to Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    await supabase
      .from('entries')
      .update({ sentiment, distortions })
      .eq('id', entry_id)

    await supabase
      .from('insights')
      .upsert({ entry_id, mirror_prompt }, { onConflict: 'entry_id' })

    return new Response(
      JSON.stringify({ sentiment, distortions, mirror_prompt }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('analyze-entry error:', error)
    return new Response(
      JSON.stringify({ error: 'Analysis failed', details: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
