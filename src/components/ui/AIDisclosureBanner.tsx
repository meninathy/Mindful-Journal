export function AIDisclosureBanner() {
  return (
    <div className="bg-mindful-blue/25 border border-mindful-blue/40 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 mb-5">
      <span className="text-base">🤖</span>
      <p className="font-body text-xs text-mindful-dark/70 leading-relaxed">
        <strong className="font-heading text-mindful-dark/90">AI-Powered Analysis</strong> — Sentiment and cognitive pattern detection is performed by an AI model (Llama 3 via Groq). This is a reflective tool, not a clinical diagnosis.
      </p>
    </div>
  )
}
