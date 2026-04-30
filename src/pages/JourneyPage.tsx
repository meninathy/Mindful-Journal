import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { useAllEntries } from '../hooks/useEntries'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SentimentBadge } from '../components/analysis/SentimentBadge'
import { WhimsicalBackground } from '../components/ui/WhimsicalBackground'
import type { Sentiment } from '../types'

const SENTIMENT_SCORE: Record<Sentiment, number> = {
  Positive: 3,
  Balanced: 2,
  'High-Distress': 1,
}

const DISTORTION_COLOR = ['#FFADDE', '#ACBEFC', '#C5C5FF']

export function JourneyPage() {
  const navigate = useNavigate()
  const { data: entries, isLoading } = useAllEntries()
  const [range, setRange] = useState<'week' | 'month' | 'year'>('month')

  const cutoff = useMemo(() => {
    const d = new Date()
    if (range === 'week') d.setDate(d.getDate() - 7)
    else if (range === 'month') d.setMonth(d.getMonth() - 1)
    else d.setFullYear(d.getFullYear() - 1)
    return d
  }, [range])

  const filtered = useMemo(
    () => (entries ?? []).filter((e) => new Date(e.created_at) >= cutoff),
    [entries, cutoff]
  )

  // Mood trend: group by date
  const moodData = useMemo(() => {
    const map = new Map<string, number[]>()
    filtered.forEach((e) => {
      if (!e.sentiment) return
      const key = new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(SENTIMENT_SCORE[e.sentiment])
    })
    return Array.from(map.entries()).map(([date, scores]) => ({
      date,
      score: +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2),
    }))
  }, [filtered])

  // Distortion frequency
  const distortionData = useMemo(() => {
    const counts: Record<string, number> = {}
    filtered.forEach((e) => {
      e.distortions.forEach((d) => {
        counts[d.type] = (counts[d.type] ?? 0) + 1
      })
    })
    return Object.entries(counts).map(([type, count]) => ({ type: type.replace(' ', '\n'), count }))
  }, [filtered])

  // Summary stats
  const stats = useMemo(() => {
    const sentimentCounts = { Positive: 0, Balanced: 0, 'High-Distress': 0 }
    filtered.forEach((e) => { if (e.sentiment) sentimentCounts[e.sentiment]++ })
    return sentimentCounts
  }, [filtered])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <WhimsicalBackground />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/')} className="p-2 text-mindful-dark/40 hover:text-mindful-dark transition-colors rounded-xl hover:bg-mindful-lavender/30 cursor-pointer">
            ←
          </button>
          <div className="flex-1">
            <h1 className="font-heading text-3xl font-bold text-mindful-dark">Your Journey</h1>
            <p className="font-body text-mindful-dark/50 text-sm">Patterns and insights over time</p>
          </div>
        </div>

        {/* Range selector */}
        <div className="flex gap-1 bg-mindful-lavender/20 rounded-2xl p-1 mb-6 w-fit">
          {(['week', 'month', 'year'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-xl font-heading font-semibold text-sm transition-all duration-200 cursor-pointer capitalize ${
                range === r ? 'bg-white shadow-sm text-mindful-dark' : 'text-mindful-dark/50 hover:text-mindful-dark'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-48 bg-mindful-lavender/20 rounded-3xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🗺️</div>
            <h2 className="font-heading text-xl text-mindful-dark mb-2">No entries in this range</h2>
            <p className="font-body text-sm text-mindful-dark/50 mb-4">Start journaling to see your journey here</p>
            <Button onClick={() => navigate('/')}>Go to Journals</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3">
              {(Object.entries(stats) as [Sentiment, number][]).map(([sentiment, count]) => (
                <Card key={sentiment} className={`text-center ${sentiment === 'High-Distress' ? 'bg-mindful-peach/20' : sentiment === 'Positive' ? 'bg-mindful-mint/20' : 'bg-mindful-blue/20'}`}>
                  <div className="text-2xl font-heading font-bold text-mindful-dark">{count}</div>
                  <SentimentBadge sentiment={sentiment} />
                </Card>
              ))}
            </div>

            {/* Mood trend chart */}
            {moodData.length > 0 && (
              <Card>
                <h2 className="font-heading text-lg font-semibold text-mindful-dark mb-4">Mood Trend</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#C5C5FF30" />
                    <XAxis dataKey="date" tick={{ fontFamily: 'Comfortaa', fontSize: 11, fill: '#3D2C4E80' }} />
                    <YAxis domain={[1, 3]} ticks={[1, 2, 3]} tickFormatter={(v) => v === 3 ? '✨' : v === 2 ? '🌊' : '🌧️'} tick={{ fontSize: 14 }} />
                    <Tooltip
                      formatter={(v) => {
                        const n = Number(v)
                        return [n === 3 ? 'Positive' : n === 2 ? 'Balanced' : 'High-Distress', 'Mood']
                      }}
                      contentStyle={{ fontFamily: 'Comfortaa', borderRadius: 12, border: '1px solid #C5C5FF' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#FFADDE" strokeWidth={2.5} dot={{ fill: '#FFADDE', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Distortion frequency chart */}
            {distortionData.length > 0 && (
              <Card>
                <h2 className="font-heading text-lg font-semibold text-mindful-dark mb-4">Cognitive Patterns</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={distortionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#C5C5FF30" horizontal={false} />
                    <XAxis type="number" tick={{ fontFamily: 'Comfortaa', fontSize: 11, fill: '#3D2C4E80' }} />
                    <YAxis type="category" dataKey="type" width={140} tick={{ fontFamily: 'Comfortaa', fontSize: 11, fill: '#3D2C4E' }} />
                    <Tooltip contentStyle={{ fontFamily: 'Comfortaa', borderRadius: 12, border: '1px solid #C5C5FF' }} />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                      {distortionData.map((_, i) => (
                        <Cell key={i} fill={DISTORTION_COLOR[i % DISTORTION_COLOR.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs font-body text-mindful-dark/40 mt-3">
                  💡 Noticing a pattern? Consider exploring it with a therapist or counselor.
                </p>
              </Card>
            )}

            {/* Total entries */}
            <Card className="bg-mindful-lavender/20 text-center">
              <p className="font-heading font-semibold text-mindful-dark">
                {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'} in the past {range}
              </p>
              <p className="font-body text-sm text-mindful-dark/50 mt-1">Keep going — every entry is a step toward self-awareness 🌱</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
