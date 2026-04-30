import type { Journal, Entry, Insight, Distortion, Sentiment } from '../types'

const KEY = {
  journals: 'ml_journals',
  entries: 'ml_entries',
  insights: 'ml_insights',
  user: 'ml_user',
}

function load<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]') } catch { return [] }
}
function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export interface LocalUser { id: string; username: string }

export function getLocalUser(): LocalUser | null {
  try { return JSON.parse(localStorage.getItem(KEY.user) ?? 'null') } catch { return null }
}
export function setLocalUser(username: string): LocalUser {
  const user: LocalUser = { id: crypto.randomUUID(), username }
  localStorage.setItem(KEY.user, JSON.stringify(user))
  return user
}
export function clearLocalUser(): void {
  localStorage.removeItem(KEY.user)
}

// Journals
export function getJournals(ownerId: string): Journal[] {
  return load<Journal>(KEY.journals)
    .filter(j => j.owner_id === ownerId)
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
}

export function addJournal(ownerId: string, title: string): Journal {
  const all = load<Journal>(KEY.journals)
  const j: Journal = { id: crypto.randomUUID(), owner_id: ownerId, title, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  save(KEY.journals, [...all, j])
  return j
}

export function removeJournal(id: string): void {
  save(KEY.journals, load<Journal>(KEY.journals).filter(j => j.id !== id))
  const keep = load<Entry>(KEY.entries).filter(e => e.journal_id !== id)
  const removedIds = new Set(load<Entry>(KEY.entries).filter(e => e.journal_id === id).map(e => e.id))
  save(KEY.entries, keep)
  save(KEY.insights, load<Insight>(KEY.insights).filter(i => !removedIds.has(i.entry_id)))
}

// Entries
function attachInsights(entries: Entry[]): Entry[] {
  const insights = load<Insight>(KEY.insights)
  return entries.map(e => ({ ...e, insights: insights.find(i => i.entry_id === e.id) ?? null }))
}

export function getEntries(journalId: string): Entry[] {
  const entries = load<Entry>(KEY.entries)
    .filter(e => e.journal_id === journalId)
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
  return attachInsights(entries)
}

export function getAllEntries(ownerId: string): Entry[] {
  const journalIds = new Set(getJournals(ownerId).map(j => j.id))
  const entries = load<Entry>(KEY.entries)
    .filter(e => journalIds.has(e.journal_id))
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
  return attachInsights(entries)
}

export function addEntry(journalId: string, content: string): Entry {
  const all = load<Entry>(KEY.entries)
  const e: Entry = { id: crypto.randomUUID(), journal_id: journalId, content, sentiment: null, distortions: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  save(KEY.entries, [...all, e])
  return e
}

export function patchEntryAnalysis(id: string, sentiment: Sentiment, distortions: Distortion[]): void {
  save(KEY.entries, load<Entry>(KEY.entries).map(e => e.id === id ? { ...e, sentiment, distortions, updated_at: new Date().toISOString() } : e))
}

export function patchEntryContent(id: string, content: string): void {
  save(KEY.entries, load<Entry>(KEY.entries).map(e => e.id === id ? { ...e, content, updated_at: new Date().toISOString() } : e))
}

export function removeEntry(id: string): void {
  save(KEY.entries, load<Entry>(KEY.entries).filter(e => e.id !== id))
  save(KEY.insights, load<Insight>(KEY.insights).filter(i => i.entry_id !== id))
}

// Insights
export function upsertInsight(entryId: string, mirrorPrompt: string): Insight {
  const without = load<Insight>(KEY.insights).filter(i => i.entry_id !== entryId)
  const insight: Insight = { id: crypto.randomUUID(), entry_id: entryId, mirror_prompt: mirrorPrompt, pattern_detected: null, created_at: new Date().toISOString() }
  save(KEY.insights, [...without, insight])
  return insight
}
