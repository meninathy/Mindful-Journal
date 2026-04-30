import { Card } from '../ui/Card'

export function MirrorPrompt({ prompt }: { prompt: string }) {
  return (
    <div className="animate-slide-up">
      <Card className="bg-gradient-to-br from-mindful-lavender/30 to-mindful-blue/20 border-mindful-lavender/40">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">🪞</span>
          <div>
            <p className="text-xs font-heading font-semibold text-mindful-dark/50 uppercase tracking-widest mb-2">Reflective Mirror</p>
            <p className="font-body text-mindful-dark leading-relaxed text-[15px] italic">"{prompt}"</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
