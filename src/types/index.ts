export type Sentiment = 'Positive' | 'Balanced' | 'High-Distress'

export type DistortionType = 'Should Statements' | 'Catastrophizing' | 'All-or-Nothing Thinking'

export interface Distortion {
  type: DistortionType
  phrase: string
}

export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Journal {
  id: string
  owner_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Entry {
  id: string
  journal_id: string
  content: string
  sentiment: Sentiment | null
  distortions: Distortion[]
  created_at: string
  updated_at: string
  insights?: Insight | null
}

export interface Insight {
  id: string
  entry_id: string
  mirror_prompt: string | null
  pattern_detected: string | null
  created_at: string
}

export interface AnalysisResult {
  sentiment: Sentiment
  distortions: Distortion[]
  mirror_prompt: string
}
