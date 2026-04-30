import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchJournals, createJournal, deleteJournal } from '../lib/api'

export function useJournals() {
  return useQuery({ queryKey: ['journals'], queryFn: fetchJournals })
}

export function useCreateJournal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createJournal,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['journals'] }),
  })
}

export function useDeleteJournal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteJournal,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['journals'] })
      qc.invalidateQueries({ queryKey: ['entries'] })
    },
  })
}
