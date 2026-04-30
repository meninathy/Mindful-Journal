import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchEntries, fetchAllEntries, createEntry, updateEntry, deleteEntry, analyzeEntry } from '../lib/api'
import { patchEntryAnalysis, upsertInsight } from '../lib/localData'
import type { Distortion, Sentiment } from '../types'

export function useEntries(journalId: string) {
  return useQuery({
    queryKey: ['entries', journalId],
    queryFn: () => fetchEntries(journalId),
    enabled: !!journalId,
  })
}

export function useAllEntries() {
  return useQuery({ queryKey: ['entries', 'all'], queryFn: fetchAllEntries })
}

export function useCreateEntry(journalId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (content: string) => {
      const entry = await createEntry(journalId, content)
      const result = await analyzeEntry(entry.id, content)
      patchEntryAnalysis(entry.id, result.sentiment as Sentiment, result.distortions as Distortion[])
      upsertInsight(entry.id, result.mirror_prompt)
      return { ...entry, sentiment: result.sentiment as Sentiment, distortions: result.distortions as Distortion[], mirror_prompt: result.mirror_prompt }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entries', journalId] })
      qc.invalidateQueries({ queryKey: ['entries', 'all'] })
    },
  })
}

export function useUpdateEntry(journalId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) => updateEntry(id, content),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['entries', journalId] }),
  })
}

export function useDeleteEntry(journalId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entries', journalId] })
      qc.invalidateQueries({ queryKey: ['entries', 'all'] })
    },
  })
}
