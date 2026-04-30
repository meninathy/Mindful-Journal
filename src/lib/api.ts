import { supabase, SUPABASE_ENABLED } from './supabase'
import * as local from './localData'
import type { Journal, Entry, Distortion, Sentiment } from '../types'

function localUserId(): string {
  const user = local.getLocalUser()
  if (!user) throw new Error('Not signed in')
  return user.id
}

// ─── Journals ────────────────────────────────────────────────────────────────

export async function fetchJournals(): Promise<Journal[]> {
  if (!SUPABASE_ENABLED) return local.getJournals(localUserId())
  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createJournal(title: string): Promise<Journal> {
  if (!SUPABASE_ENABLED) return local.addJournal(localUserId(), title)
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('journals')
    .insert({ title, owner_id: user!.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteJournal(id: string): Promise<void> {
  if (!SUPABASE_ENABLED) { local.removeJournal(id); return }
  const { error } = await supabase.from('journals').delete().eq('id', id)
  if (error) throw error
}

// ─── Entries ─────────────────────────────────────────────────────────────────

function normalizeEntries(rows: Record<string, unknown>[]): Entry[] {
  return rows.map((e) => ({
    ...e,
    distortions: (e.distortions as Distortion[]) ?? [],
    insights: Array.isArray(e.insights) ? (e.insights[0] ?? null) : (e.insights ?? null),
  })) as Entry[]
}

export async function fetchEntries(journalId: string): Promise<Entry[]> {
  if (!SUPABASE_ENABLED) return local.getEntries(journalId)
  const { data, error } = await supabase
    .from('entries')
    .select('*, insights(*)')
    .eq('journal_id', journalId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return normalizeEntries(data)
}

export async function fetchAllEntries(): Promise<Entry[]> {
  if (!SUPABASE_ENABLED) return local.getAllEntries(localUserId())
  const { data, error } = await supabase
    .from('entries')
    .select('*, insights(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return normalizeEntries(data)
}

export async function createEntry(journalId: string, content: string): Promise<Entry> {
  if (!SUPABASE_ENABLED) return local.addEntry(journalId, content)
  const { data, error } = await supabase
    .from('entries')
    .insert({ journal_id: journalId, content })
    .select()
    .single()
  if (error) throw error
  return { ...data, distortions: [], insights: null }
}

export async function updateEntry(id: string, content: string): Promise<void> {
  if (!SUPABASE_ENABLED) { local.patchEntryContent(id, content); return }
  const { error } = await supabase.from('entries').update({ content }).eq('id', id)
  if (error) throw error
}

export async function deleteEntry(id: string): Promise<void> {
  if (!SUPABASE_ENABLED) { local.removeEntry(id); return }
  const { error } = await supabase.from('entries').delete().eq('id', id)
  if (error) throw error
}

export async function patchAnalysis(
  entryId: string,
  sentiment: Sentiment,
  distortions: Distortion[],
  mirrorPrompt: string
): Promise<void> {
  if (!SUPABASE_ENABLED) {
    local.patchEntryAnalysis(entryId, sentiment, distortions)
    local.upsertInsight(entryId, mirrorPrompt)
    return
  }
  await supabase.from('entries').update({ sentiment, distortions }).eq('id', entryId)
  await supabase
    .from('insights')
    .upsert({ entry_id: entryId, mirror_prompt: mirrorPrompt }, { onConflict: 'entry_id' })
}

// ─── AI Analysis ─────────────────────────────────────────────────────────────

export async function analyzeEntry(
  _entryId: string,
  content: string
): Promise<{ sentiment: Sentiment; distortions: Distortion[]; mirror_prompt: string }> {
  const res = await fetch('/api/analyze-entry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) {
    let msg = `Server error ${res.status}`
    try { const j = await res.json(); msg = j.error ?? msg } catch { msg = await res.text() || msg }
    throw new Error(msg)
  }
  return res.json()
}
