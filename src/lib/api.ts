import * as local from './localData'
import type { Journal, Entry, Sentiment, Distortion } from '../types'

function userId(): string {
  const user = local.getLocalUser()
  if (!user) throw new Error('Not signed in')
  return user.id
}

// Journals
export async function fetchJournals(): Promise<Journal[]> {
  return local.getJournals(userId())
}

export async function createJournal(title: string): Promise<Journal> {
  return local.addJournal(userId(), title)
}

export async function deleteJournal(id: string): Promise<void> {
  local.removeJournal(id)
}

// Entries
export async function fetchEntries(journalId: string): Promise<Entry[]> {
  return local.getEntries(journalId)
}

export async function fetchAllEntries(): Promise<Entry[]> {
  return local.getAllEntries(userId())
}

export async function createEntry(journalId: string, content: string): Promise<Entry> {
  return local.addEntry(journalId, content)
}

export async function updateEntry(id: string, content: string): Promise<void> {
  local.patchEntryContent(id, content)
}

export async function deleteEntry(id: string): Promise<void> {
  local.removeEntry(id)
}

// AI Analysis — calls local Express server
export async function analyzeEntry(_entryId: string, content: string): Promise<{ sentiment: Sentiment; distortions: Distortion[]; mirror_prompt: string }> {
  const res = await fetch('/api/analyze-entry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
