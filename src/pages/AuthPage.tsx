import { useState } from 'react'
import { setLocalUser } from '../lib/localData'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { WhimsicalBackground } from '../components/ui/WhimsicalBackground'

export function AuthPage() {
  const { setUser } = useAuthStore()
  const [name, setName] = useState('')

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const user = setLocalUser(name.trim())
    setUser(user)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <WhimsicalBackground />

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 animate-float inline-block">📓</div>
          <h1 className="font-heading text-4xl font-bold text-mindful-dark">The Mindful Log</h1>
          <p className="font-body text-mindful-dark/60 mt-2">Your empathetic journaling companion</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-4xl shadow-soft border border-mindful-lavender/30 p-8">
          <div className="text-center mb-6">
            <p className="font-heading font-semibold text-mindful-dark text-lg">What should we call you?</p>
            <p className="font-body text-mindful-dark/50 text-sm mt-1">Your data stays on this device</p>
          </div>

          <form onSubmit={handleStart} className="space-y-4">
            <Input
              placeholder="Your name or nickname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <Button type="submit" disabled={!name.trim()} className="w-full">
              Start Journaling →
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-mindful-dark/40 mt-4 font-body px-4">
          The Mindful Log is not a substitute for professional mental health care.
        </p>
      </div>
    </div>
  )
}
