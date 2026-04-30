import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchJournals } from '../lib/api'
import { useEntries, useCreateEntry, useDeleteEntry } from '../hooks/useEntries'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { SentimentBadge } from '../components/analysis/SentimentBadge'
import { DistortionBadge } from '../components/analysis/DistortionBadge'
import { MirrorPrompt } from '../components/analysis/MirrorPrompt'
import { GroundingAid } from '../components/grounding/GroundingAid'
import { CrisisSupport } from '../components/grounding/CrisisSupport'
import { WhimsicalBackground } from '../components/ui/WhimsicalBackground'
import { AIDisclosureBanner } from '../components/ui/AIDisclosureBanner'
import type { Entry } from '../types'

function HighlightedText({ content, distortions }: { content: string; distortions: Entry['distortions'] }) {
  if (!distortions.length) return <p className="font-body text-mindful-dark/80 leading-relaxed whitespace-pre-wrap">{content}</p>

  let result = content
  const parts: Array<{ text: string; highlighted: boolean; phrase?: string }> = []

  // Sort distortions by phrase length (longest first) to avoid partial matches
  const phrases = distortions.map((d) => d.phrase).filter(Boolean)
  if (!phrases.length) return <p className="font-body text-mindful-dark/80 leading-relaxed whitespace-pre-wrap">{content}</p>

  const regex = new RegExp(`(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  const split = result.split(regex)

  split.forEach((part) => {
    const isHighlighted = phrases.some((p) => p.toLowerCase() === part.toLowerCase())
    parts.push({ text: part, highlighted: isHighlighted })
  })

  return (
    <p className="font-body text-mindful-dark/80 leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) =>
        part.highlighted ? (
          <mark key={i} className="bg-mindful-peach/60 rounded px-0.5 not-italic">{part.text}</mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </p>
  )
}

function EntryCard({ entry, onDelete }: { entry: Entry; onDelete: () => void }) {
  const [showGrounding, setShowGrounding] = useState(false)
  const isDistressed = entry.sentiment === 'High-Distress'

  return (
    <>
      <Card className={`animate-slide-up ${isDistressed ? 'border-mindful-peach/50 bg-mindful-peach/5' : ''}`}>
        {/* Entry header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {entry.sentiment && <SentimentBadge sentiment={entry.sentiment} />}
            {entry.distortions.map((d, i) => (
              <DistortionBadge key={i} type={d.type} />
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <p className="text-xs font-body text-mindful-dark/40">
              {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
            <button
              onClick={onDelete}
              className="p-1.5 text-mindful-dark/25 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Entry text */}
        <HighlightedText content={entry.content} distortions={entry.distortions} />

        {/* Grounding Aid CTA for High-Distress */}
        {isDistressed && (
          <div className="mt-4 p-4 bg-mindful-peach/20 rounded-2xl border border-mindful-peach/40 flex items-center justify-between gap-3">
            <div>
              <p className="font-heading font-semibold text-sm text-mindful-dark">Feeling overwhelmed?</p>
              <p className="font-body text-xs text-mindful-dark/60 mt-0.5">Try the 5-4-3-2-1 grounding technique</p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setShowGrounding(true)} className="shrink-0 bg-mindful-peach text-mindful-dark">
              Ground Me Now 🌿
            </Button>
          </div>
        )}

        {/* Reflective Mirror */}
        {entry.insights?.mirror_prompt && !isDistressed && (
          <div className="mt-4">
            <MirrorPrompt prompt={entry.insights.mirror_prompt} />
          </div>
        )}
      </Card>

      {showGrounding && <GroundingAid onClose={() => setShowGrounding(false)} />}
    </>
  )
}

export function JournalPage() {
  const { id: journalId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: entries, isLoading } = useEntries(journalId!)
  const createEntry = useCreateEntry(journalId!)
  const deleteEntry = useDeleteEntry(journalId!)
  const [content, setContent] = useState('')
  const [showGrounding, setShowGrounding] = useState(false)
  const [showCrisis, setShowCrisis] = useState(false)

  const { data: journal } = useQuery({
    queryKey: ['journal', journalId],
    queryFn: async () => {
      const journals = await fetchJournals()
      return journals.find(j => j.id === journalId) ?? null
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    const text = content.trim()
    setContent('') // clear immediately so the user can keep writing
    try {
      await createEntry.mutateAsync(text)
    } catch {
      // error is displayed via createEntry.error below
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <WhimsicalBackground />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/')} className="p-2 text-mindful-dark/40 hover:text-mindful-dark transition-colors rounded-xl hover:bg-mindful-lavender/30 cursor-pointer">
            ←
          </button>
          <div className="flex-1">
            <h1 className="font-heading text-2xl font-bold text-mindful-dark">{journal?.title ?? '...'}</h1>
            <p className="font-body text-mindful-dark/40 text-xs">{entries?.length ?? 0} entries</p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setShowGrounding(true)}>
            🌿 Ground Me
          </Button>
          <Button size="sm" variant="danger" onClick={() => setShowCrisis(true)}>
            🆘 Crisis Help
          </Button>
        </div>

        <AIDisclosureBanner />

        {/* New entry form */}
        <Card className="mb-6 border-mindful-pink/30 bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="font-heading text-xs font-semibold text-mindful-dark/40 uppercase tracking-widest">New Entry</p>
            <Textarea
              placeholder="What's on your mind today? Write freely — this is your safe space..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="text-[15px]"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs font-body text-mindful-dark/30">{content.length} characters</p>
              <Button
                type="submit"
                loading={createEntry.isPending}
                disabled={!content.trim()}
              >
                {createEntry.isPending ? 'Analyzing...' : 'Save & Reflect ✨'}
              </Button>
            </div>
            {createEntry.isPending && (
              <div className="flex items-center gap-2 text-xs font-body text-mindful-dark/50 animate-pulse-soft">
                <span>🤖</span> Entry saved — AI is crafting your reflection...
              </div>
            )}
            {createEntry.isError && (
              <div className="flex items-center gap-2 text-xs font-body text-orange-600 bg-orange-50 rounded-2xl px-3 py-2">
                <span>⚠️</span>
                {createEntry.error instanceof Error ? createEntry.error.message : 'Analysis failed — make sure the server is running with npm run dev'}
              </div>
            )}
          </form>
        </Card>

        {/* Entries list */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => <div key={i} className="h-32 bg-mindful-lavender/20 rounded-3xl animate-pulse" />)}
          </div>
        ) : entries?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🌱</div>
            <p className="font-heading text-lg text-mindful-dark">Your journal is empty</p>
            <p className="font-body text-sm text-mindful-dark/50 mt-1">Write your first entry above</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries?.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onDelete={() => {
                  if (confirm('Delete this entry?')) deleteEntry.mutate(entry.id)
                }}
              />
            ))}
          </div>
        )}

        {/* AI disclaimer */}
        <p className="text-center text-xs text-mindful-dark/30 mt-8 font-body px-4">
          ✨ AI analysis is for reflective purposes only — not a substitute for professional mental health support
        </p>
      </div>

      {showGrounding && <GroundingAid onClose={() => setShowGrounding(false)} />}
      {showCrisis && <CrisisSupport onClose={() => setShowCrisis(false)} />}
    </div>
  )
}
