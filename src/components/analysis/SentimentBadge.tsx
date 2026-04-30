import type { Sentiment } from '../../types'

const config: Record<Sentiment, { emoji: string; label: string; className: string }> = {
  Positive: { emoji: '✨', label: 'Positive', className: 'badge-positive' },
  Balanced: { emoji: '🌊', label: 'Balanced', className: 'badge-balanced' },
  'High-Distress': { emoji: '🌧️', label: 'High-Distress', className: 'badge-distress' },
}

export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const { emoji, label, className } = config[sentiment]
  return (
    <span className={className}>
      {emoji} {label}
    </span>
  )
}
