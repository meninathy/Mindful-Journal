import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchEntries, fetchAllEntries, createEntry, updateEntry, deleteEntry, analyzeEntry, patchAnalysis } from '../lib/api'
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
      qc.invalidateQueries({ queryKey: ['entries', journalId] })

      try {
        const result = await analyzeEntry(entry.id, content)
        await patchAnalysis(entry.id, result.sentiment as Sentiment, result.distortions as Distortion[], result.mirror_prompt)
        qc.invalidateQueries({ queryKey: ['entries', journalId] })
        qc.invalidateQueries({ queryKey: ['entries', 'all'] })
      } catch (err) {
        console.error('Analysis failed:', err)
        throw new Error('Entry saved, but AI analysis failed. Check that the server is running.')
      }

      return entry
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
