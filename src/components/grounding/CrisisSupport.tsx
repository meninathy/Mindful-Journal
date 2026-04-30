const RESOURCES = [
  { name: '988 Suicide & Crisis Lifeline', action: 'Call or text 988', icon: '📞', href: 'tel:988' },
  { name: 'Crisis Text Line', action: 'Text HOME to 741741', icon: '💬', href: 'sms:741741?body=HOME' },
  { name: 'SAMHSA Helpline', action: '1-800-662-4357 (free, 24/7)', icon: '🏥', href: 'tel:18006624357' },
  { name: 'Emergency Services', action: 'Call 911 if in immediate danger', icon: '🚨', href: 'tel:911' },
]

interface CrisisSupportProps {
  onClose: () => void
}

export function CrisisSupport({ onClose }: CrisisSupportProps) {
  return (
    <div className="fixed inset-0 bg-mindful-dark/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-4xl p-8 max-w-md w-full shadow-soft animate-slide-up">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="font-heading text-xl font-bold text-mindful-dark">You're not alone 💙</h2>
            <p className="font-body text-sm text-mindful-dark/60 mt-1">Free, confidential support is available 24/7</p>
          </div>
          <button onClick={onClose} className="text-mindful-dark/30 hover:text-mindful-dark transition-colors text-xl cursor-pointer">✕</button>
        </div>

        <div className="space-y-3 mt-5">
          {RESOURCES.map((r) => (
            <a
              key={r.name}
              href={r.href}
              className="flex items-center gap-3 p-4 rounded-2xl bg-mindful-lavender/20 hover:bg-mindful-lavender/40 transition-colors group"
            >
              <span className="text-2xl">{r.icon}</span>
              <div>
                <p className="font-heading font-semibold text-mindful-dark text-sm">{r.name}</p>
                <p className="font-body text-xs text-mindful-dark/60">{r.action}</p>
              </div>
              <span className="ml-auto text-mindful-dark/30 group-hover:text-mindful-dark transition-colors">→</span>
            </a>
          ))}
        </div>

        <p className="text-center text-xs text-mindful-dark/40 font-body mt-5 leading-relaxed">
          This app uses AI and is not a licensed mental health service. Please reach out to a professional if you need support.
        </p>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-3xl bg-mindful-mint/30 text-mindful-dark font-heading font-semibold text-sm hover:bg-mindful-mint/50 transition-colors cursor-pointer"
        >
          I'm okay, go back to journaling
        </button>
      </div>
    </div>
  )
}
