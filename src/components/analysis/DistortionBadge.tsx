import type { DistortionType } from '../../types'

const config: Record<DistortionType, { emoji: string; color: string }> = {
  'Should Statements': { emoji: '⚡', color: 'bg-mindful-yellow/60 text-amber-700' },
  'Catastrophizing': { emoji: '🌪️', color: 'bg-red-100 text-red-700' },
  'All-or-Nothing Thinking': { emoji: '🎭', color: 'bg-mindful-lavender/60 text-purple-700' },
}

export function DistortionBadge({ type }: { type: DistortionType }) {
  const { emoji, color } = config[type]
  return (
    <span className={`badge ${color}`}>
      {emoji} {type}
    </span>
  )
}
