import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { goalsAPI } from '../api'
import toast from 'react-hot-toast'
import styles from './Goals.module.css'

/* ── Icons ─────────────────────────────────────────────────────── */
const Icon = {
  Plus: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  Export: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>),
  Search: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  ChevDown: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>),
  Edit: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  Trash: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>),
  Eye: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  Calendar: () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
  Flag: () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>),
  Target: () => (<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>),
  X: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
}

/* ── Config ─────────────────────────────────────────────────────── */
const STATUS_CFG = {
  completed:   { label: 'Completed',   cls: 'badge-green', bar: '#10b981' },
  in_progress: { label: 'In Progress', cls: 'badge-blue',  bar: '#6366f1' },
  not_started: { label: 'Not Started', cls: 'badge-gray',  bar: '#9ca3af' },
  paused:      { label: 'Paused',      cls: 'badge-amber', bar: '#f59e0b' },
}
const PRIORITY_CFG = {
  high:   { label: 'High',   color: '#ef4444', bg: '#fef2f2', stripe: '#ef4444' },
  medium: { label: 'Medium', color: '#f59e0b', bg: '#fffbeb', stripe: '#f59e0b' },
  low:    { label: 'Low',    color: '#6b7280', bg: '#f9fafb', stripe: '#d1d5db' },
}
const STATUS_TABS = [
  { key: '',            label: 'All'         },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'not_started', label: 'Not Started' },
  { key: 'completed',   label: 'Completed'   },
  { key: 'paused',      label: 'Paused'      },
]

/* ── Goal card ──────────────────────────────────────────────────── */
function GoalCard({ goal, onEdit, onDelete }) {
  const st = STATUS_CFG[goal.status]     ?? STATUS_CFG.not_started
  const pr = PRIORITY_CFG[goal.priority] ?? PRIORITY_CFG.medium
  const daysLeft = goal.target_date
    ? Math.ceil((new Date(goal.target_date) - new Date()) / 86400000)
    : null

  return (
    <div className={styles.card}>
      <div className={styles.stripe} style={{ background: pr.stripe }} />
      <div className={styles.cardBody}>
        {goal.image && <img src={goal.image} alt={goal.title} className={styles.cardImg} />}

        <div className={styles.badgeRow}>
          <span className={`badge ${st.cls}`}>{st.label}</span>
          <span className={styles.priorPill} style={{ color: pr.color, background: pr.bg }}>
            <Icon.Flag /> {pr.label}
          </span>
          {goal.category_name && <span className="badge badge-gray">{goal.category_name}</span>}
        </div>

        <Link to={`/goals/${goal.id}`} className={styles.cardTitle}>{goal.title}</Link>

        {goal.description && (
          <p className={styles.cardDesc}>
            {goal.description.length > 100 ? goal.description.slice(0, 100) + '…' : goal.description}
          </p>
        )}

        <div>
          <div className={styles.progRow}>
            <span className={styles.progLabel}>Progress</span>
            <span className={styles.progPct} style={{ color: st.bar }}>{goal.progress}%</span>
          </div>
          <div className={styles.progTrack}>
            <div className={styles.progFill} style={{ width: `${goal.progress}%`, background: st.bar }} />
          </div>
        </div>

        {goal.target_date && (
          <p className={styles.deadline} style={{ color: daysLeft !== null && daysLeft < 0 ? '#ef4444' : '#9ca3af' }}>
            <Icon.Calendar />
            {daysLeft === null ? goal.target_date
              : daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue`
              : daysLeft === 0 ? 'Due today'
              : `${daysLeft} days left`}
          </p>
        )}

        <div className={styles.cardFooter}>
          <Link to={`/goals/${goal.id}`} className={styles.viewBtn}><Icon.Eye /> View</Link>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className={styles.iconBtn} onClick={() => onEdit(goal)}><Icon.Edit /></button>
            <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => onDelete(goal.id)}><Icon.Trash /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Modal ──────────────────────────────────────────────────────── */
function GoalModal({ goal, categories, onClose, onSaved }) {
  const isEdit = Boolean(goal)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: goal
      ? { title: goal.title, description: goal.description, status: goal.status,
          priority: goal.priority, progress: goal.progress,
          target_date: goal.target_date || '', category: goal.category || '', is_public: goal.is_public }
      : { status: 'not_started', priority: 'medium', progress: 0, is_public: false },
  })

  const onSubmit = async (data) => {
    try {
      isEdit ? await goalsAPI.update(goal.id, data) : await goalsAPI.create(data)
      toast.success(isEdit ? 'Goal updated' : 'Goal created')
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.title?.[0] || 'Failed to save')
    }
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.mHeader}>
          <h2 className={styles.mTitle}>{isEdit ? 'Edit Goal' : 'New Goal'}</h2>
          <button className={styles.mClose} onClick={onClose}><Icon.X /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.mForm}>
          <div className={styles.field}>
            <label className={styles.label}>Title <span style={{ color: '#ef4444' }}>*</span></label>
            <input className={`${styles.input} ${errors.title ? styles.inputErr : ''}`}
              placeholder="What do you want to achieve?"
              {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className={styles.errMsg}>{errors.title.message}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description <span className={styles.opt}>(optional)</span></label>
            <textarea className={styles.textarea} rows={3}
              placeholder="Why does this goal matter?" {...register('description')} />
          </div>

          <div className={styles.twoCol}>
            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <div className={styles.selWrap}>
                <select className={styles.sel} {...register('status')}>
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>
                <span className={styles.selIcon}><Icon.ChevDown /></span>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Priority</label>
              <div className={styles.selWrap}>
                <select className={styles.sel} {...register('priority')}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <span className={styles.selIcon}><Icon.ChevDown /></span>
              </div>
            </div>
          </div>

          <div className={styles.twoCol}>
            <div className={styles.field}>
              <label className={styles.label}>Progress (%)</label>
              <input type="number" min={0} max={100} className={styles.input}
                {...register('progress', { min: 0, max: 100 })} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Target Date</label>
              <input type="date" className={styles.input} {...register('target_date')} />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <div className={styles.selWrap}>
              <select className={styles.sel} {...register('category')}>
                <option value="">— No category —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
              <span className={styles.selIcon}><Icon.ChevDown /></span>
            </div>
          </div>

          <label className={styles.toggleRow}>
            <input type="checkbox" className={styles.toggleCheck} {...register('is_public')} />
            <span className={styles.toggleTrack} />
            <span className={styles.toggleLabel}>Make this goal public</span>
          </label>

          <div className={styles.mActions}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function Goals() {
  const [goals, setGoals]           = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [editGoal, setEditGoal]     = useState(null)
  const [search, setSearch]         = useState('')
  const [statusTab, setStatusTab]   = useState('')
  const [priority, setPriority]     = useState('')
  const [categoryF, setCategoryF]   = useState('')
  const [page, setPage]             = useState(1)
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null })

  const fetchGoals = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const params = { page: p }
      if (search)    params.search   = search
      if (statusTab) params.status   = statusTab
      if (priority)  params.priority = priority
      if (categoryF) params.category = categoryF
      const { data } = await goalsAPI.list(params)
      setGoals(data.results ?? data)
      setPagination({ count: data.count ?? 0, next: data.next, previous: data.previous })
    } catch { toast.error('Failed to load goals') }
    finally   { setLoading(false) }
  }, [search, statusTab, priority, categoryF])

  useEffect(() => {
    goalsAPI.categories().then(r => setCategories(r.data.results ?? r.data))
  }, [])
  useEffect(() => { setPage(1); fetchGoals(1) }, [search, statusTab, priority, categoryF])
  useEffect(() => { fetchGoals(page) }, [page])

  const handleExportPDF = async () => {
    try {
      const r = await goalsAPI.exportPDF()
      const url = URL.createObjectURL(new Blob([r.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url; a.download = 'my_goals.pdf'; a.click()
      toast.success('PDF exported')
    } catch { toast.error('Export failed') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return
    try { await goalsAPI.delete(id); toast.success('Goal deleted'); fetchGoals(page) }
    catch { toast.error('Delete failed') }
  }

  const openEdit = (g)  => { setEditGoal(g);   setShowModal(true) }
  const onSaved  = ()   => { setShowModal(false); fetchGoals(page) }

  const avgProg = goals.length
    ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length)
    : 0

  return (
    <div className="fade-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Goals</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Define, track and achieve what matters most.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
            onClick={handleExportPDF}>
            <Icon.Export /> Export PDF
          </button>
          <button className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => { setEditGoal(null); setShowModal(true) }}>
            <Icon.Plus /> New Goal
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className={styles.statsStrip}>
        {[
          { label: 'Total Goals',   val: pagination.count,                        color: '#6366f1' },
          { label: 'In Progress',   val: goals.filter(g=>g.status==='in_progress').length, color: '#3b82f6' },
          { label: 'Completed',     val: goals.filter(g=>g.status==='completed').length,   color: '#10b981' },
          { label: 'Avg. Progress', val: `${avgProg}%`,                           color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className={styles.statCell}>
            <p className={styles.statVal} style={{ color: s.color }}>{s.val}</p>
            <p className={styles.statLbl}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIco}><Icon.Search /></span>
          <input className={styles.searchInp} placeholder="Search goals…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className={styles.selWrap} style={{ width: 140 }}>
          <select className={styles.sel} value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <span className={styles.selIcon}><Icon.ChevDown /></span>
        </div>
        {categories.length > 0 && (
          <div className={styles.selWrap} style={{ width: 160 }}>
            <select className={styles.sel} value={categoryF} onChange={e => setCategoryF(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
            <span className={styles.selIcon}><Icon.ChevDown /></span>
          </div>
        )}
      </div>

      {/* Status tabs */}
      <div className={styles.tabs}>
        {STATUS_TABS.map(t => (
          <button key={t.key}
            className={`${styles.tab} ${statusTab === t.key ? styles.tabActive : ''}`}
            onClick={() => setStatusTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', paddingTop:'3rem' }}>
          <div className="spinner" />
        </div>
      ) : goals.length === 0 ? (
        <div className={styles.empty}>
          <div style={{ color: '#d1d5db', marginBottom: '1rem' }}><Icon.Target /></div>
          <p className={styles.emptyTitle}>
            {search || statusTab || priority || categoryF ? 'No goals match your filters' : 'No goals yet'}
          </p>
          <p className={styles.emptySub}>
            {search || statusTab || priority || categoryF
              ? 'Try adjusting your search or filters.'
              : 'Create your first goal and start making progress.'}
          </p>
          {!(search || statusTab || priority || categoryF) && (
            <button className="btn btn-primary"
              style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:'1.25rem' }}
              onClick={() => { setEditGoal(null); setShowModal(true) }}>
              <Icon.Plus /> Create First Goal
            </button>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {goals.map(g => <GoalCard key={g.id} goal={g} onEdit={openEdit} onDelete={handleDelete} />)}
        </div>
      )}

      {/* Pagination */}
      {(pagination.next || pagination.previous) && (
        <div className={styles.pager}>
          <button className="btn btn-secondary" disabled={!pagination.previous}
            onClick={() => setPage(p => p - 1)}>← Previous</button>
          <span className={styles.pagerLabel}>Page {page} · {pagination.count} total</span>
          <button className="btn btn-secondary" disabled={!pagination.next}
            onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {showModal && (
        <GoalModal goal={editGoal} categories={categories}
          onClose={() => setShowModal(false)} onSaved={onSaved} />
      )}
    </div>
  )
}