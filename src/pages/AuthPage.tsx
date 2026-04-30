import { useState } from 'react'
import { supabase, SUPABASE_ENABLED } from '../lib/supabase'
import { setLocalUser } from '../lib/localData'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { WhimsicalBackground } from '../components/ui/WhimsicalBackground'

function LocalAuthForm() {
  const { setUser } = useAuthStore()
  const [name, setName] = useState('')

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const user = setLocalUser(name.trim())
    setUser({ id: user.id, username: user.username })
  }

  return (
    <form onSubmit={handleStart} className="space-y-4">
      <Input placeholder="Your name or nickname" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      <Button type="submit" disabled={!name.trim()} className="w-full">Start Journaling →</Button>
    </form>
  )
}

function SupabaseAuthForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setMessage(''); setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (data.user) {
          await supabase.from('profiles').upsert({ id: data.user.id, username: email.split('@')[0] })
        }
        setMessage('Check your email for a confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex gap-1 bg-mindful-lavender/20 rounded-2xl p-1 mb-6">
        {(['login', 'signup'] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-xl font-heading font-semibold text-sm transition-all duration-200 cursor-pointer ${mode === m ? 'bg-white shadow-sm text-mindful-dark' : 'text-mindful-dark/50 hover:text-mindful-dark'}`}>
            {m === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" type="email" placeholder="hello@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div className="bg-red-50 text-red-600 rounded-2xl px-4 py-3 text-sm font-body">{error}</div>}
        {message && <div className="bg-mindful-mint/30 text-emerald-700 rounded-2xl px-4 py-3 text-sm font-body">{message}</div>}
        <Button type="submit" loading={loading} className="w-full mt-2">
          {mode === 'login' ? 'Sign In' : 'Create Account'} →
        </Button>
      </form>
    </>
  )
}

export function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <WhimsicalBackground />
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 animate-float inline-block">📓</div>
          <h1 className="font-heading text-4xl font-bold text-mindful-dark">The Mindful Log</h1>
          <p className="font-body text-mindful-dark/60 mt-2">Your empathetic journaling companion</p>
        </div>

        {/* AI Disclosure — prominent on auth page */}
        <div className="bg-mindful-blue/30 border border-mindful-blue/50 rounded-2xl px-4 py-3 mb-4 flex items-start gap-2">
          <span className="text-lg">🤖</span>
          <p className="font-body text-sm text-mindful-dark/80">
            <strong className="font-heading">AI-Powered:</strong> This app uses artificial intelligence to analyze your journal entries. It is <strong>not</strong> a mental health professional or substitute for therapy.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-4xl shadow-soft border border-mindful-lavender/30 p-8">
          {SUPABASE_ENABLED
            ? <SupabaseAuthForm />
            : (
              <>
                <div className="text-center mb-6">
                  <p className="font-heading font-semibold text-mindful-dark text-lg">What should we call you?</p>
                  <p className="font-body text-mindful-dark/50 text-sm mt-1">Your data stays on this device</p>
                </div>
                <LocalAuthForm />
              </>
            )
          }
        </div>

        <p className="text-center text-xs text-mindful-dark/40 mt-4 font-body px-4">
          The Mindful Log is not a substitute for professional mental health care. If you are in crisis, call or text <strong>988</strong>.
        </p>
      </div>
    </div>
  )
}
