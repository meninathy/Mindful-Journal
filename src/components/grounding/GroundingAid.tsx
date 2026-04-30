import { useState } from 'react'
import { Button } from '../ui/Button'

const steps = [
  { count: 5, sense: 'see', icon: '👁️', instruction: 'Look around and name 5 things you can see right now.' },
  { count: 4, sense: 'feel', icon: '🤲', instruction: 'Notice 4 things you can physically feel — texture, temperature, pressure.' },
  { count: 3, sense: 'hear', icon: '👂', instruction: 'Listen closely for 3 sounds in your environment.' },
  { count: 2, sense: 'smell', icon: '👃', instruction: 'Find 2 things you can smell, or recall 2 favourite scents.' },
  { count: 1, sense: 'taste', icon: '👅', instruction: 'Notice 1 thing you can taste right now.' },
]

interface GroundingAidProps {
  onClose: () => void
}

export function GroundingAid({ onClose }: GroundingAidProps) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  const current = steps[step]

  const advance = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <div className="fixed inset-0 bg-mindful-dark/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white rounded-4xl p-8 max-w-md w-full shadow-soft text-center animate-slide-up">
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="font-heading text-2xl text-mindful-dark mb-2">Well done!</h2>
          <p className="font-body text-mindful-dark/70 mb-6">You just grounded yourself using the 5-4-3-2-1 technique. Take a breath. You're here. You're okay.</p>
          <Button onClick={onClose} className="w-full">I feel better</Button>
        </div>
      </div>
    )
  }

  const progress = ((step) / steps.length) * 100

  return (
    <div className="fixed inset-0 bg-mindful-dark/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-4xl p-8 max-w-md w-full shadow-soft animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-heading font-semibold text-mindful-dark/40 uppercase tracking-widest">Grounding Exercise</p>
            <h2 className="font-heading text-xl text-mindful-dark">5-4-3-2-1 Technique</h2>
          </div>
          <button onClick={onClose} className="text-mindful-dark/30 hover:text-mindful-dark transition-colors text-xl">✕</button>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-mindful-lavender/30 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-mindful-mint rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step content */}
        <div key={step} className="text-center animate-slide-up">
          <div className="text-6xl mb-4">{current.icon}</div>
          <div className="bg-mindful-mint/20 rounded-3xl p-3 inline-block mb-4">
            <span className="font-heading font-bold text-4xl text-emerald-600">{current.count}</span>
          </div>
          <p className="font-heading text-lg font-semibold text-mindful-dark mb-2 capitalize">
            Things you can {current.sense}
          </p>
          <p className="font-body text-mindful-dark/60 text-sm mb-8 leading-relaxed">{current.instruction}</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <Button variant="ghost" onClick={() => setStep(step - 1)} className="flex-1">
              Back
            </Button>
          )}
          <Button onClick={advance} className="flex-1">
            {step < steps.length - 1 ? `Got it — next (${current.count - 1})` : 'All done! ✨'}
          </Button>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= step ? 'bg-mindful-mint' : 'bg-mindful-lavender/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
