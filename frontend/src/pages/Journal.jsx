import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { journalAPI } from '../api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import toast from 'react-hot-toast'

/* ── SVG Icons ──────────────────────────────────────────── */
const IcPlus     = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>)
const IcSearch   = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>)
const IcChevDown = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>)
const IcChevR    = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>)
const IcEdit     = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>)
const IcTrash    = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>)
const IcTag      = () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>)
const IcCalendar = () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>)
const IcBook     = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>)
const IcX        = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>)

/* ── Mood config ────────────────────────────────────────── */
const MOODS = [
  { value: 1, label: 'Very Bad', color: '#ef4444', bg: '#fef2f2',
    face: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> },
  { value: 2, label: 'Bad',     color: '#f97316', bg: '#fff7ed',
    face: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 15s-1-1.5-3-1.5-3 1.5-3 1.5"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> },
  { value: 3, label: 'Neutral', color: '#f59e0b', bg: '#fffbeb',
    face: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> },
  { value: 4, label: 'Good',    color: '#22c55e', bg: '#f0fdf4',
    face: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> },
  { value: 5, label: 'Excellent', color: '#6366f1', bg: '#eff0ff',
    face: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><path d="M9 8.5c.5-.5 1-.5 1.5 0"/><path d="M13.5 8.5c.5-.5 1-.5 1.5 0"/></svg> },
]
const moodMap = Object.fromEntries(MOODS.map(m => [m.value, m]))

/* ── Reusable shared styles ─────────────────────────────── */
const S = {
  input: { width: '100%', height: 38, padding: '0 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.875rem', fontFamily: 'inherit', color: '#111827', background: '#fff', outline: 'none' },
  textarea: { width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.875rem', fontFamily: 'inherit', color: '#111827', background: '#fff', outline: 'none', resize: 'vertical', lineHeight: 1.6 },
  label: { fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 },
  iBtn: { width: 28, height: 28, borderRadius: 7, border: 'none', background: 'transparent', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
}

/* ── Custom tooltip ─────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const m = moodMap[Math.round(payload[0].value)]
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ fontWeight: 600, color: '#111827', marginBottom: 2 }}>{label}</p>
      <p style={{ display: 'flex', alignItems: 'center', gap: 5, color: m?.color }}>
        <span style={{ color: m?.color }}>{m?.face}</span> {payload[0].value.toFixed(1)}
      </p>
    </div>
  )
}

/* ── Journal Modal ──────────────────────────────────────── */
function JournalModal({ entry, tags, onClose, onSaved }) {
  const isEdit = Boolean(entry)
  const [mood, setMood]               = useState(entry?.mood ?? 3)
  const [selectedTags, setSelectedTags] = useState(entry?.tags?.map(t => t.id ?? t) ?? [])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: entry
      ? { title: entry.title, content: entry.content }
      : {},
  })

  const toggleTag = (id) =>
    setSelectedTags(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, mood, tag_ids: selectedTags }
      isEdit
        ? await journalAPI.update(entry.id, payload)
        : await journalAPI.create(payload)
      toast.success(isEdit ? 'Entry updated' : 'Entry saved')
      onSaved()
    } catch { toast.error('Failed to save') }
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem', backdropFilter: 'blur(2px)' }}
    >
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 580, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem 0' }}>
          <h2 style={{ fontFamily: 'var(--font-display,"Syne",sans-serif)', fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>
            {isEdit ? 'Edit Entry' : 'New Journal Entry'}
          </h2>
          <button style={{ ...S.iBtn, background: '#f3f4f6', color: '#6b7280', width: 30, height: 30 }} onClick={onClose}><IcX /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '1.1rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Mood picker */}
          <div>
            <label style={S.label}>How are you feeling?</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {MOODS.map(m => (
                <button key={m.value} type="button"
                  onClick={() => setMood(m.value)}
                  title={m.label}
                  style={{
                    flex: 1, padding: '8px 4px', borderRadius: 10, border: `1.5px solid ${mood === m.value ? m.color : '#e5e7eb'}`,
                    background: mood === m.value ? m.bg : '#f9fafb',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    transition: 'all 0.15s', transform: mood === m.value ? 'scale(1.06)' : 'scale(1)',
                  }}>
                  <span style={{ color: mood === m.value ? m.color : '#9ca3af' }}>{m.face}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, color: mood === m.value ? m.color : '#9ca3af' }}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={S.label}>Title <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              style={{ ...S.input, borderColor: errors.title ? '#ef4444' : '#e5e7eb' }}
              placeholder="Give this entry a title…"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 3 }}>{errors.title.message}</p>}
          </div>

          {/* Content */}
          <div>
            <label style={S.label}>Write <span style={{ color: '#ef4444' }}>*</span></label>
            <textarea
              style={{ ...S.textarea, borderColor: errors.content ? '#ef4444' : '#e5e7eb', minHeight: 160 }}
              placeholder="What's on your mind today? Write freely…"
              rows={7}
              {...register('content', { required: 'Content is required' })}
            />
            {errors.content && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 3 }}>{errors.content.message}</p>}
          </div>

          {/* Tags */}
          {tags?.length > 0 && (
            <div>
              <label style={S.label}>Tags</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {tags.map(t => {
                  const active = selectedTags.includes(t.id)
                  return (
                    <button key={t.id} type="button" onClick={() => toggleTag(t.id)}
                      style={{
                        padding: '4px 12px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 500,
                        border: `1.5px solid ${active ? t.color : '#e5e7eb'}`,
                        background: active ? t.color + '18' : '#f9fafb',
                        color: active ? t.color : '#6b7280',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}>
                      {t.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: 4 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Journal card ───────────────────────────────────────── */
function JournalCard({ entry, onEdit, onDelete }) {
  const mood    = moodMap[entry.mood] ?? moodMap[3]
  const preview = entry.content?.slice(0, 150) + (entry.content?.length > 150 ? '…' : '')
  const words   = entry.word_count ?? entry.content?.split(/\s+/).length ?? 0

  return (
    <div style={{
      display: 'flex', background: '#fff', border: '1px solid #f0f4f8',
      borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.18s, transform 0.18s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 5px 18px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Mood bar */}
      <div style={{ width: 4, background: mood.color, flexShrink: 0 }} />

      <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0 }}>
        {/* Head row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: mood.bg, color: mood.color,
            fontSize: '0.75rem', fontWeight: 600,
            padding: '3px 10px', borderRadius: 99,
          }}>
            <span style={{ color: mood.color, display: 'flex' }}>{mood.face}</span>
            {mood.label}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              style={{ ...S.iBtn, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#374151' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af' }}
              onClick={() => onEdit(entry)} title="Edit">
              <IcEdit />
            </button>
            <button
              style={{ ...S.iBtn, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af' }}
              onClick={() => onDelete(entry.id)} title="Delete">
              <IcTrash />
            </button>
          </div>
        </div>

        {/* Title */}
        <Link to={`/journal/${entry.id}`} style={{
          fontFamily: 'var(--font-display,"Syne",sans-serif)', fontSize: '0.95rem',
          fontWeight: 700, color: '#111827', textDecoration: 'none',
          transition: 'color 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
          onMouseLeave={e => e.currentTarget.style.color = '#111827'}>
          {entry.title}
        </Link>

        {/* Preview */}
        <p style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.6 }}>{preview}</p>

        {/* Tags */}
        {entry.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: '#9ca3af', display: 'flex' }}><IcTag /></span>
            {entry.tags.map(t => (
              <span key={t.id ?? t} style={{
                fontSize: '0.72rem', fontWeight: 500,
                background: (t.color ?? '#6366f1') + '18',
                color: t.color ?? '#6366f1',
                padding: '2px 8px', borderRadius: 99,
              }}>{t.name ?? t}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#9ca3af' }}>
              <IcCalendar /> {entry.created_at?.slice(0, 10)}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{words} words</span>
          </div>
          <Link to={`/journal/${entry.id}`} style={{
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: '0.78rem', fontWeight: 600, color: '#6366f1', textDecoration: 'none',
          }}>
            Read <IcChevR />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────── */
export default function Journal() {
  const [entries, setEntries]       = useState([])
  const [tags, setTags]             = useState([])
  const [moodStats, setMoodStats]   = useState(null)
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [editEntry, setEditEntry]   = useState(null)
  const [search, setSearch]         = useState('')
  const [moodFilter, setMoodFilter] = useState('')
  const [page, setPage]             = useState(1)
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null })

  const load = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const params = { page: p }
      if (search)     params.search = search
      if (moodFilter) params.mood   = moodFilter
      const [er, tr, mr] = await Promise.all([
        journalAPI.list(params),
        journalAPI.tags(),
        journalAPI.moodStats(),
      ])
      setEntries(er.data.results ?? er.data)
      setPagination({ count: er.data.count ?? 0, next: er.data.next, previous: er.data.previous })
      setTags(tr.data.results ?? tr.data)
      setMoodStats(mr.data)
    } catch { toast.error('Failed to load journal') }
    finally   { setLoading(false) }
  }, [search, moodFilter])

  useEffect(() => { setPage(1); load(1) }, [load])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return
    try { await journalAPI.delete(id); toast.success('Entry deleted'); load(page) }
    catch { toast.error('Delete failed') }
  }

  const openEdit = (e) => { setEditEntry(e); setShowModal(true) }
  const onSaved  = ()  => { setShowModal(false); load(page) }

  return (
    <div className="fade-up">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Journal</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            {moodStats?.total_entries ?? 0} entries
            {moodStats?.overall_avg_mood && ` · Avg mood ${Number(moodStats.overall_avg_mood).toFixed(1)}`}
          </p>
        </div>
        <button className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={() => { setEditEntry(null); setShowModal(true) }}>
          <IcPlus /> New Entry
        </button>
      </div>

      {/* ── Mood trend chart ── */}
      {moodStats?.mood_trend?.length > 0 && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontFamily: 'var(--font-display,"Syne",sans-serif)', fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: '0.85rem' }}>
            Mood Trend (30 days)
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={moodStats.mood_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={d => d.slice(5)} />
              <YAxis domain={[1, 5]} hide />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="avg_mood" stroke="#6366f1" strokeWidth={2.5}
                dot={{ fill: '#6366f1', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#6366f1' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Mood filter pills ── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button
          onClick={() => setMoodFilter('')}
          style={{
            padding: '5px 14px', borderRadius: 99, border: `1.5px solid ${moodFilter === '' ? '#6366f1' : '#e5e7eb'}`,
            background: moodFilter === '' ? '#eff0ff' : '#fff',
            color: moodFilter === '' ? '#6366f1' : '#6b7280',
            fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
          }}>
          All
        </button>
        {MOODS.map(m => (
          <button key={m.value}
            onClick={() => setMoodFilter(moodFilter === String(m.value) ? '' : String(m.value))}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px', borderRadius: 99,
              border: `1.5px solid ${moodFilter === String(m.value) ? m.color : '#e5e7eb'}`,
              background: moodFilter === String(m.value) ? m.bg : '#fff',
              color: moodFilter === String(m.value) ? m.color : '#6b7280',
              fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
            }}>
            <span style={{ color: moodFilter === String(m.value) ? m.color : '#9ca3af', display: 'flex' }}>{m.face}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={{ position: 'relative', maxWidth: 360, marginBottom: '1.1rem' }}>
        <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', display: 'flex', pointerEvents: 'none' }}>
          <IcSearch />
        </span>
        <input
          style={{ ...S.input, paddingLeft: 32 }}
          placeholder="Search journal entries…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '3rem' }}>
          <div className="spinner" />
        </div>
      ) : entries.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4.5rem 1rem', textAlign: 'center' }}>
          <div style={{ color: '#d1d5db', marginBottom: '1rem' }}><IcBook /></div>
          <p style={{ fontFamily: 'var(--font-display,"Syne",sans-serif)', fontSize: '1.05rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>
            {search || moodFilter ? 'No entries match your search' : 'No journal entries yet'}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            {search || moodFilter ? 'Try a different keyword or clear the mood filter.' : 'Start writing to document your growth journey.'}
          </p>
          {!(search || moodFilter) && (
            <button className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: '1.25rem' }}
              onClick={() => { setEditEntry(null); setShowModal(true) }}>
              <IcPlus /> Write First Entry
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {entries.map(e => (
            <JournalCard key={e.id} entry={e} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {(pagination.next || pagination.previous) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6' }}>
          <button className="btn btn-secondary" disabled={!pagination.previous}
            onClick={() => { setPage(p => p - 1) }}>← Previous</button>
          <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Page {page} · {pagination.count} entries</span>
          <button className="btn btn-secondary" disabled={!pagination.next}
            onClick={() => { setPage(p => p + 1) }}>Next →</button>
        </div>
      )}

      {showModal && (
        <JournalModal
          entry={editEntry}
          tags={tags}
          onClose={() => setShowModal(false)}
          onSaved={onSaved}
        />
      )}
    </div>
  )
}