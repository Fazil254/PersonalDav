import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { goalsAPI } from '../api'
import toast from 'react-hot-toast'
import styles from './GoalDetail.module.css'

/* ── Icons ───────────────────────────────────────────────── */
const Icon = {
  Back: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Edit: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Delete: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
  Check: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Flag: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Clock: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Note: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Milestone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 6"/><path d="M6 12h12"/><path d="M6 18h6"/>
      <circle cx="20" cy="18" r="3"/>
    </svg>
  ),
  X: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
}

/* ── Config ──────────────────────────────────────────────── */
const STATUS_CONFIG = {
  completed:   { label: 'Completed',   cls: 'badge-green', barColor: '#10b981' },
  in_progress: { label: 'In Progress', cls: 'badge-blue',  barColor: '#6366f1' },
  not_started: { label: 'Not Started', cls: 'badge-gray',  barColor: '#9ca3af' },
  paused:      { label: 'Paused',      cls: 'badge-amber', barColor: '#f59e0b' },
}

const PRIORITY_CONFIG = {
  high:   { label: 'High Priority',   color: '#ef4444', bg: '#fef2f2' },
  medium: { label: 'Medium Priority', color: '#f59e0b', bg: '#fffbeb' },
  low:    { label: 'Low Priority',    color: '#6b7280', bg: '#f9fafb' },
}

/* ── Milestone row ───────────────────────────────────────── */
function MilestoneRow({ milestone, onToggle, onDelete }) {
  return (
    <div className={`${styles.milestoneRow} ${milestone.is_completed ? styles.milestoneRowDone : ''}`}>
      <button
        className={`${styles.checkbox} ${milestone.is_completed ? styles.checkboxChecked : ''}`}
        onClick={() => onToggle(milestone.id, milestone.is_completed)}
        aria-label="Toggle milestone"
      >
        {milestone.is_completed && <Icon.Check />}
      </button>

      <span className={`${styles.milestoneTitle} ${milestone.is_completed ? styles.milestoneTitleDone : ''}`}>
        {milestone.title}
      </span>

      {milestone.due_date && (
        <span className={styles.milestoneMeta}>
          <Icon.Calendar /> {milestone.due_date}
        </span>
      )}

      <button className={styles.milestoneDelete} onClick={() => onDelete(milestone.id)} aria-label="Delete">
        <Icon.X />
      </button>
    </div>
  )
}

/* ── Note card ───────────────────────────────────────────── */
function NoteCard({ note }) {
  return (
    <div className={styles.noteCard}>
      <p className={styles.noteText}>{note.content}</p>
      <span className={styles.noteMeta}>
        <Icon.Clock /> {note.created_at?.slice(0, 10)}
      </span>
    </div>
  )
}

/* ── Main ────────────────────────────────────────────────── */
export default function GoalDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const [goal, setGoal]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [newMilestone, setNewMilestone] = useState('')
  const [newNote, setNewNote]       = useState('')
  const [savingProgress, setSaving] = useState(false)

  const load = async () => {
    try {
      const r = await goalsAPI.get(id)
      setGoal(r.data)
    } catch {
      toast.error('Goal not found')
      navigate('/goals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const addMilestone = async () => {
    if (!newMilestone.trim()) return
    try {
      await goalsAPI.createMilestone(id, { title: newMilestone })
      setNewMilestone('')
      toast.success('Milestone added')
      load()
    } catch { toast.error('Failed to add milestone') }
  }

  const toggleMilestone = async (mId, current) => {
    try {
      await goalsAPI.updateMilestone(mId, { is_completed: !current })
      load()
    } catch { toast.error('Failed to update milestone') }
  }

  const deleteMilestone = async (mId) => {
    try { await goalsAPI.deleteMilestone(mId); load() }
    catch { toast.error('Failed to delete milestone') }
  }

  const addNote = async () => {
    if (!newNote.trim()) return
    try {
      await goalsAPI.addNote(id, { content: newNote })
      setNewNote('')
      toast.success('Note added')
      load()
    } catch { toast.error('Failed to add note') }
  }

  const updateProgress = async (val) => {
    setSaving(true)
    try {
      await goalsAPI.update(id, { progress: parseInt(val) })
      toast.success('Progress updated')
      load()
    } catch { toast.error('Failed to update progress') }
    finally { setSaving(false) }
  }

  /* ── Loading ── */
  if (loading) return (
    <div style={{ paddingTop: '4rem', display: 'flex', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  )
  if (!goal) return null

  /* ── Derived values ── */
  const status   = STATUS_CONFIG[goal.status]   || STATUS_CONFIG.not_started
  const priority = PRIORITY_CONFIG[goal.priority] || PRIORITY_CONFIG.medium

  const milestoneDone  = goal.milestones?.filter(m => m.is_completed).length ?? 0
  const milestoneTotal = goal.milestones?.length ?? 0

  const daysLeft = goal.target_date
    ? Math.ceil((new Date(goal.target_date) - new Date()) / 86400000)
    : null

  return (
    <div className="fade-up">

      {/* ── Top nav ── */}
      <div className={styles.topNav}>
        <Link to="/goals" className={styles.backLink}>
          <Icon.Back /> Back to Goals
        </Link>
        <Link to={`/goals/${id}/edit`} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
          <Icon.Edit /> Edit Goal
        </Link>
      </div>

      <div className={styles.layout}>

        {/* ══ LEFT COLUMN ══════════════════════════════════ */}
        <div className={styles.leftCol}>

          {/* ── Hero card ── */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {goal.image && (
              <img
                src={goal.image} alt={goal.title}
                className={styles.heroImage}
              />
            )}
            <div style={{ padding: '1.25rem 1.5rem' }}>

              {/* Badges row */}
              <div className={styles.badgeRow}>
                <span className={`badge ${status.cls}`}>{status.label}</span>
                <span className={styles.priorityPill}
                  style={{ color: priority.color, background: priority.bg }}>
                  <Icon.Flag /> {priority.label}
                </span>
                {goal.category_name && (
                  <span className="badge badge-gray">{goal.category_name}</span>
                )}
              </div>

              {/* Title */}
              <h1 className={styles.goalTitle}>{goal.title}</h1>

              {/* Description */}
              {goal.description && (
                <p className={styles.goalDesc}>{goal.description}</p>
              )}

              {/* Progress */}
              <div className={styles.progressSection}>
                <div className={styles.progressLabelRow}>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>
                    Overall Progress
                  </span>
                  <span style={{
                    fontSize: '0.8rem', fontWeight: 700,
                    color: status.barColor,
                  }}>
                    {goal.progress}%
                    {savingProgress && <span style={{ color: '#9ca3af', marginLeft: 6 }}>saving…</span>}
                  </span>
                </div>

                {/* Visual bar */}
                <div style={{
                  height: 10, borderRadius: 99, background: '#f3f4f6',
                  overflow: 'hidden', margin: '6px 0',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${goal.progress}%`,
                    background: status.barColor,
                    borderRadius: 99,
                    transition: 'width 0.4s ease',
                  }} />
                </div>

                {/* Range input */}
                <input
                  type="range" min={0} max={100}
                  value={goal.progress}
                  style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
                  onChange={e =>
                    setGoal(g => ({ ...g, progress: parseInt(e.target.value) }))
                  }
                  onMouseUp={e => updateProgress(e.target.value)}
                  onTouchEnd={e => updateProgress(e.target.value)}
                />
                <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 2 }}>
                  Drag to update progress
                </p>
              </div>

              {/* Meta strip */}
              <div className={styles.metaStrip}>
                {goal.target_date && (
                  <span className={styles.metaItem}
                    style={{ color: daysLeft !== null && daysLeft < 0 ? '#ef4444' : '#6b7280' }}>
                    <Icon.Calendar />
                    {daysLeft === null
                      ? goal.target_date
                      : daysLeft < 0
                      ? `${Math.abs(daysLeft)}d overdue`
                      : daysLeft === 0
                      ? 'Due today'
                      : `${daysLeft} days left`}
                  </span>
                )}
                <span className={styles.metaItem}>
                  <Icon.Clock /> Created {goal.created_at?.slice(0, 10)}
                </span>
                {goal.completed_at && (
                  <span className={styles.metaItem} style={{ color: '#10b981' }}>
                    <Icon.Check /> Done {goal.completed_at.slice(0, 10)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Notes ── */}
          <div className="card">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon} style={{ background: '#f0fdf4', color: '#10b981' }}>
                <Icon.Note />
              </span>
              <h3 className={styles.sectionTitle}>Notes</h3>
              <span className={styles.sectionCount}>{goal.notes?.length ?? 0}</span>
            </div>

            {/* Add note */}
            <div className={styles.addRow}>
              <textarea
                className={styles.textarea}
                rows={2}
                placeholder="Capture a thought, reflection, or update…"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
              />
              <button
                className="btn btn-primary"
                style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem' }}
                onClick={addNote}
              >
                <Icon.Plus /> Add
              </button>
            </div>

            {/* Notes list */}
            {(goal.notes?.length ?? 0) === 0 ? (
              <p className={styles.emptyMsg}>No notes yet. Add a reflection above.</p>
            ) : (
              <div className={styles.notesList}>
                {goal.notes.map(n => <NoteCard key={n.id} note={n} />)}
              </div>
            )}
          </div>
        </div>

        {/* ══ RIGHT COLUMN ══════════════════════════════════ */}
        <div className={styles.rightCol}>

          {/* ── Milestone summary ── */}
          {milestoneTotal > 0 && (
            <div className={styles.milestoneSummary}>
              <div className={styles.milestoneSummaryBar}>
                <div
                  className={styles.milestoneSummaryFill}
                  style={{ width: `${Math.round((milestoneDone / milestoneTotal) * 100)}%` }}
                />
              </div>
              <p className={styles.milestoneSummaryText}>
                <strong>{milestoneDone}</strong> of <strong>{milestoneTotal}</strong> milestones done
                {' '}· {Math.round((milestoneDone / milestoneTotal) * 100)}%
              </p>
            </div>
          )}

          {/* ── Milestones card ── */}
          <div className="card">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon} style={{ background: '#eff6ff', color: '#6366f1' }}>
                <Icon.Milestone />
              </span>
              <h3 className={styles.sectionTitle}>Milestones</h3>
              <span className={styles.sectionCount}>{milestoneTotal}</span>
            </div>

            {/* Add milestone */}
            <div className={styles.addRow} style={{ marginBottom: '1rem' }}>
              <input
                className={styles.input}
                placeholder="Add a milestone… (press Enter)"
                value={newMilestone}
                onChange={e => setNewMilestone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addMilestone()}
              />
              <button
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                onClick={addMilestone}
              >
                <Icon.Plus /> Add
              </button>
            </div>

            {/* Milestones list */}
            {milestoneTotal === 0 ? (
              <p className={styles.emptyMsg}>
                No milestones yet. Break your goal into smaller steps!
              </p>
            ) : (
              <div className={styles.milestonesList}>
                {/* Incomplete first */}
                {goal.milestones
                  .filter(m => !m.is_completed)
                  .map(m => (
                    <MilestoneRow
                      key={m.id}
                      milestone={m}
                      onToggle={toggleMilestone}
                      onDelete={deleteMilestone}
                    />
                  ))}
                {/* Completed */}
                {goal.milestones.filter(m => m.is_completed).length > 0 && (
                  <>
                    <p className={styles.milestoneSeparator}>Completed</p>
                    {goal.milestones
                      .filter(m => m.is_completed)
                      .map(m => (
                        <MilestoneRow
                          key={m.id}
                          milestone={m}
                          onToggle={toggleMilestone}
                          onDelete={deleteMilestone}
                        />
                      ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}