import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { journalAPI } from '../api'
import toast from 'react-hot-toast'

/* ── SVG Icons ──────────────────────────────────────────── */
const IcBack  = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>)
const IcEdit  = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>)
const IcTrash = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>)
const IcSave  = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>)
const IcClose = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>)
const IcClock = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>)
const IcTag   = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>)
const IcWords = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>)

/* ── Mood config ────────────────────────────────────────── */
const MOODS = [
  { value: 1, label: 'Very Bad',  color: '#ef4444', bg: '#fef2f2',
    face: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> },
  { value: 2, label: 'Bad',       color: '#f97316', bg: '#fff7ed',
    face: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 15s-1-1.5-3-1.5-3 1.5-3 1.5"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> },
  { value: 3, label: 'Neutral',   color: '#f59e0b', bg: '#fffbeb',
    face: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> },
  { value: 4, label: 'Good',      color: '#22c55e', bg: '#f0fdf4',
    face: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> },
  { value: 5, label: 'Excellent', color: '#6366f1', bg: '#eff0ff',
    face: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><path d="M9 8.5c.5-.5 1-.5 1.5 0"/><path d="M13.5 8.5c.5-.5 1-.5 1.5 0"/></svg> },
]
const moodMap = Object.fromEntries(MOODS.map(m => [m.value, m]))

/* ── Shared style helpers ───────────────────────────────── */
const inp = (err) => ({
  width: '100%', height: 38, padding: '0 12px',
  border: `1px solid ${err ? '#ef4444' : '#e5e7eb'}`,
  borderRadius: 8, fontSize: '0.875rem', fontFamily: 'inherit',
  color: '#111827', background: '#fff', outline: 'none',
})
const txta = (err) => ({
  width: '100%', padding: '10px 12px', resize: 'vertical',
  border: `1px solid ${err ? '#ef4444' : '#e5e7eb'}`,
  borderRadius: 8, fontSize: '0.95rem', fontFamily: 'inherit',
  color: '#1f2937', background: '#fff', outline: 'none',
  lineHeight: 1.85, minHeight: 240,
})

/* ── Main ───────────────────────────────────────────────── */
export default function JournalDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [entry, setEntry]           = useState(null)
  const [editing, setEditing]       = useState(false)
  const [loading, setLoading]       = useState(true)
  const [selectedMood, setMood]     = useState(3)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  const load = async () => {
    try {
      const { data } = await journalAPI.get(id)
      setEntry(data)
      setMood(data.mood)
      reset({ title: data.title, content: data.content })
    } catch {
      toast.error('Entry not found')
      navigate('/journal')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  const onSubmit = async (data) => {
    try {
      await journalAPI.update(id, { ...data, mood: selectedMood })
      toast.success('Entry updated')
      setEditing(false)
      load()
    } catch { toast.error('Update failed') }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this journal entry? This cannot be undone.')) return
    try {
      await journalAPI.delete(id)
      toast.success('Entry deleted')
      navigate('/journal')
    } catch { toast.error('Delete failed') }
  }

  /* Loading */
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
      <div className="spinner" />
    </div>
  )
  if (!entry) return null

  const mood  = moodMap[entry.mood] ?? moodMap[3]
  const words = entry.word_count ?? entry.content?.split(/\s+/).length ?? 0

  return (
    <div className="fade-up" style={{ maxWidth: 740, margin: '0 auto' }}>
      {/* ── Top nav ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <Link to="/journal" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
          <IcBack /> Back to Journal
        </Link>
        <div style={{ display: 'flex', gap: 8 }}>
          {!editing ? (
            <>
              <button className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
                onClick={() => setEditing(true)}>
                <IcEdit /> Edit
              </button>
              <button
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: 'none', background: '#fef2f2', color: '#ef4444', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}
                onClick={handleDelete}>
                <IcTrash /> Delete
              </button>
            </>
          ) : (
            <button className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
              onClick={() => setEditing(false)}>
              <IcClose /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* ── Card ── */}
      <div className="card" style={{ padding: '1.75rem 2rem' }}>

        {/* ══ EDIT MODE ══ */}
        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

            {/* Mood picker */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
                How are you feeling?
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {MOODS.map(m => (
                  <button key={m.value} type="button" onClick={() => setMood(m.value)}
                    title={m.label}
                    style={{
                      flex: 1, padding: '8px 4px', borderRadius: 10,
                      border: `1.5px solid ${selectedMood === m.value ? m.color : '#e5e7eb'}`,
                      background: selectedMood === m.value ? m.bg : '#f9fafb',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      transition: 'all 0.15s', transform: selectedMood === m.value ? 'scale(1.06)' : 'scale(1)',
                    }}>
                    <span style={{ color: selectedMood === m.value ? m.color : '#9ca3af' }}>{m.face}</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: selectedMood === m.value ? m.color : '#9ca3af' }}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
                Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input style={inp(errors.title)}
                {...register('title', { required: 'Title is required' })} />
              {errors.title && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 3 }}>{errors.title.message}</p>}
            </div>

            {/* Content */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
                Content <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea style={txta(errors.content)} rows={12}
                {...register('content', { required: 'Content is required' })} />
              {errors.content && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 3 }}>{errors.content.message}</p>}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary"
                disabled={isSubmitting}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <IcSave /> {isSubmitting ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>

        ) : (
          /* ══ VIEW MODE ══ */
          <>
            {/* Mood + meta header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: '1.25rem' }}>
              {/* Large mood face */}
              <div style={{
                width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                background: mood.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: mood.color,
              }}>
                {mood.face}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Meta strip */}
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600, color: mood.color, background: mood.bg, padding: '3px 10px', borderRadius: 99 }}>
                    {mood.face} {mood.label}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#9ca3af' }}>
                    <IcClock /> {entry.created_at?.slice(0, 10)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#9ca3af' }}>
                    <IcWords /> {words} words
                  </span>
                </div>

                {/* Title */}
                <h1 style={{ fontFamily: 'var(--font-display,"Syne",sans-serif)', fontSize: '1.55rem', fontWeight: 800, color: '#111827', lineHeight: 1.25 }}>
                  {entry.title}
                </h1>
              </div>
            </div>

            {/* Tags */}
            {entry.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ color: '#9ca3af', display: 'flex' }}><IcTag /></span>
                {entry.tags.map(t => (
                  <span key={t.id ?? t} style={{
                    fontSize: '0.78rem', fontWeight: 500, padding: '3px 10px', borderRadius: 99,
                    background: (t.color ?? '#6366f1') + '18', color: t.color ?? '#6366f1',
                  }}>{t.name ?? t}</span>
                ))}
              </div>
            )}

            {/* Body text */}
            <div style={{
              fontSize: '1rem', lineHeight: 1.9, color: '#374151',
              whiteSpace: 'pre-wrap', paddingTop: entry.tags?.length > 0 ? 0 : '1.25rem',
              borderTop: entry.tags?.length > 0 ? 'none' : '1px solid #f3f4f6',
            }}>
              {entry.content}
            </div>

            {/* Updated note */}
            {entry.updated_at && entry.updated_at !== entry.created_at && (
              <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                Last edited {entry.updated_at?.slice(0, 10)}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}