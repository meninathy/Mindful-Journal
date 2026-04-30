import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJournals, useCreateJournal, useDeleteJournal } from '../hooks/useJournals'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { WhimsicalBackground } from '../components/ui/WhimsicalBackground'
import { clearLocalUser } from '../lib/localData'
import { useAuthStore } from '../store/authStore'

const JOURNAL_COLORS = [
  'bg-mindful-pink/30',
  'bg-mindful-blue/30',
  'bg-mindful-mint/30',
  'bg-mindful-lavender/30',
  'bg-mindful-peach/30',
]

export function DashboardPage() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const { data: journals, isLoading } = useJournals()
  const createJournal = useCreateJournal()
  const deleteJournal = useDeleteJournal()
  const [newTitle, setNewTitle] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    await createJournal.mutateAsync(newTitle.trim())
    setNewTitle('')
    setCreating(false)
  }

  const handleSignOut = () => {
    clearLocalUser()
    setUser(null)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <WhimsicalBackground />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-mindful-dark">My Journals</h1>
            <p className="font-body text-mindful-dark/50 text-sm mt-0.5">A safe space to explore your thoughts</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate('/journey')}>
              📊 Journey
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Create new journal */}
        {creating ? (
          <Card className="mb-6 animate-slide-up border-mindful-pink/40 bg-mindful-pink/5">
            <form onSubmit={handleCreate} className="flex gap-3">
              <Input
                placeholder="Journal name (e.g., Work Stress, Gratitude 2026)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
              <Button type="submit" loading={createJournal.isPending} size="sm">
                Create
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setCreating(false)}>
                Cancel
              </Button>
            </form>
          </Card>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="w-full mb-6 border-2 border-dashed border-mindful-lavender/50 rounded-3xl p-5 text-mindful-dark/50 hover:border-mindful-pink hover:text-mindful-pink font-heading font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            + New Journal
          </button>
        )}

        {/* Journal list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-mindful-lavender/20 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : journals?.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="font-heading text-xl text-mindful-dark mb-2">No journals yet</h2>
            <p className="font-body text-mindful-dark/50 text-sm">Create your first journal to start reflecting</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {journals?.map((journal, i) => (
              <Card
                key={journal.id}
                hoverable
                className={`${JOURNAL_COLORS[i % JOURNAL_COLORS.length]} border-transparent`}
                onClick={() => navigate(`/journal/${journal.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📖</span>
                    <div>
                      <h3 className="font-heading font-semibold text-mindful-dark">{journal.title}</h3>
                      <p className="text-xs font-body text-mindful-dark/50 mt-0.5">
                        {new Date(journal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Delete "${journal.title}"? This cannot be undone.`)) {
                        deleteJournal.mutate(journal.id)
                      }
                    }}
                    className="p-2 text-mindful-dark/30 hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 cursor-pointer"
                  >
                    🗑️
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
