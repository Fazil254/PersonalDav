import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { habitsAPI } from '../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'
import styles from './Habits.module.css'

/* ── Icons ──────────────────────────────────────────────── */
const Icon = {
  Plus:     () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  Check:    () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  Edit:     () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  Trash:    () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>),
  Flame:    () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c2.76 0 5-2.24 5-5 0-1.59-.44-2.51-1.5-3.5-1 1-1.5 1.5-2 1.5s-.5-1.5.5-2.5c-2 1-3 3-2.5 5-.5-.5-.5-1.5 0-2.5-1.5 1-2 2.5-2 4z"/></svg>),
  Repeat:   () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>),
  Activity: () => (<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>),
  ChevDown: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>),
  X:        () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
}

/* ── Habit SVG icon set (replaces emojis) ───────────────── */
const HABIT_ICONS = [
  {
    id: 'dumbbell',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M6 5v14M18 5v14"/><path d="M2 9h4M18 9h4M2 15h4M18 15h4"/><line x1="6" y1="12" x2="18" y2="12"/></svg>,
  },
  {
    id: 'book',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  },
  {
    id: 'meditation',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="5" r="2"/><path d="M6 20c0-4 2-6 6-6s6 2 6 6"/><path d="M3 15c2-1 4-2 9-2s7 1 9 2"/></svg>,
  },
  {
    id: 'run',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="13" cy="4" r="2"/><path d="M7 22l2-7 3 3 3-5 2 4"/><path d="M4 12l4-2 2 3 4-4 3 1"/></svg>,
  },
  {
    id: 'water',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M12 2C6 8 4 13 4 16a8 8 0 0 0 16 0c0-3-2-8-8-14z"/></svg>,
  },
  {
    id: 'salad',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M12 22a9 9 0 0 1-9-9c0-4.97 9-13 9-13s9 8.03 9 13a9 9 0 0 1-9 9z"/><path d="M9 15l3-3 3 3"/></svg>,
  },
  {
    id: 'sleep',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  },
  {
    id: 'write',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><line x1="17" y1="3" x2="21" y2="7"/><path d="M3 21l4-4L19.5 4.5a2.121 2.121 0 0 0-3-3L4 19z"/><path d="M15 6l3 3"/></svg>,
  },
  {
    id: 'target',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  },
  {
    id: 'music',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  },
  {
    id: 'leaf',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M17 8C8 10 5 16 5 19c0 0 3-4 9-4 0-3 3-7 3-7z"/><path d="M5 19c2-4 6-6 10-7"/></svg>,
  },
  {
    id: 'heart',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  },
]

const COLOR_PRESETS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:8, padding:'8px 12px', fontSize:12 }}>
      <p style={{ fontWeight:600, color:'#111827', marginBottom:2 }}>{label}</p>
      <p style={{ color:'#6366f1' }}>Done: <strong>{payload[0]?.value}</strong></p>
    </div>
  )
}

/* ── Get SVG by id ──────────────────────────────────────── */
function getIconSvg(iconId) {
  const found = HABIT_ICONS.find(i => i.id === iconId)
  return found ? found.svg : HABIT_ICONS[0].svg
}

/* ── Habit Modal ────────────────────────────────────────── */
function HabitModal({ habit, onClose, onSaved }) {
  const isEdit = Boolean(habit)
  const [iconId, setIconId] = useState(habit?.icon || 'dumbbell')
  const [color,  setColor]  = useState(habit?.color || '#6366f1')

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: habit
      ? { name: habit.name, description: habit.description, frequency: habit.frequency, target_days: habit.target_days, is_active: habit.is_active }
      : { frequency: 'daily', target_days: 1, is_active: true },
  })

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, icon: iconId, color }
      isEdit ? await habitsAPI.update(habit.id, payload) : await habitsAPI.create(payload)
      toast.success(isEdit ? 'Habit updated' : 'Habit created')
      onSaved()
    } catch { toast.error('Failed to save habit') }
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.mHeader}>
          <h2 className={styles.mTitle}>{isEdit ? 'Edit Habit' : 'New Habit'}</h2>
          <button className={styles.mClose} onClick={onClose}><Icon.X /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.mForm}>

          {/* SVG Icon picker */}
          <div className={styles.field}>
            <label className={styles.label}>Icon</label>
            <div className={styles.iconGrid}>
              {HABIT_ICONS.map(({ id, svg }) => (
                <button key={id} type="button"
                  className={`${styles.iconBtn} ${iconId === id ? styles.iconBtnActive : ''}`}
                  style={iconId === id ? { borderColor: color, background: color + '18', color } : {}}
                  onClick={() => setIconId(id)}
                  title={id}
                >
                  {svg}
                </button>
              ))}
            </div>
          </div>

          {/* Colour */}
          <div className={styles.field}>
            <label className={styles.label}>Colour</label>
            <div className={styles.colorRow}>
              {COLOR_PRESETS.map(c => (
                <button key={c} type="button"
                  className={`${styles.colorDot} ${color === c ? styles.colorDotActive : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)} />
              ))}
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                className={styles.colorCustom} title="Custom colour" />
            </div>
          </div>

          {/* Name */}
          <div className={styles.field}>
            <label className={styles.label}>Name <span style={{ color:'#ef4444' }}>*</span></label>
            <input className={styles.input} placeholder="e.g. Morning meditation…"
              {...register('name', { required: true })} />
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label}>Description <span className={styles.opt}>(optional)</span></label>
            <input className={styles.input} placeholder="Why does this habit matter?"
              {...register('description')} />
          </div>

          {/* Frequency + Target */}
          <div className={styles.twoCol}>
            <div className={styles.field}>
              <label className={styles.label}>Frequency</label>
              <div className={styles.selWrap}>
                <select className={styles.sel} {...register('frequency')}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
                <span className={styles.selIcon}><Icon.ChevDown /></span>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Target days/wk</label>
              <input type="number" min={1} max={7} className={styles.input}
                {...register('target_days')} />
            </div>
          </div>

          <div className={styles.mActions}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Habit Card ─────────────────────────────────────────── */
function HabitCard({ habit, onToggle, onEdit, onDelete }) {
  const iconSvg = getIconSvg(habit.icon)

  return (
    <div className={`${styles.card} ${habit.today_completed ? styles.cardDone : ''}`}>
      <div className={styles.cardStripe} style={{ background: habit.color || '#6366f1' }} />

      <div className={styles.cardBody}>
        {/* Header */}
        <div className={styles.cardHead}>
          <div className={styles.cardLeft}>
            <div className={styles.cardIconWrap} style={{
              background: (habit.color || '#6366f1') + '18',
              color: habit.color || '#6366f1',
              border: `1.5px solid ${habit.color || '#6366f1'}30`,
            }}>
              {iconSvg}
            </div>
            <div>
              <p className={styles.cardName}>{habit.name}</p>
              <p className={styles.cardFreq}>
                <Icon.Repeat />
                <span style={{ textTransform: 'capitalize' }}>{habit.frequency}</span>
              </p>
            </div>
          </div>
          <div style={{ display:'flex', gap:4 }}>
            <button className={styles.iBtn} onClick={() => onEdit(habit)} title="Edit">
              <Icon.Edit />
            </button>
            <button className={`${styles.iBtn} ${styles.iBtnDanger}`} onClick={() => onDelete(habit.id)} title="Delete">
              <Icon.Trash />
            </button>
          </div>
        </div>

        {/* Description */}
        {habit.description && <p className={styles.cardDesc}>{habit.description}</p>}

        {/* Stats row */}
        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <div style={{ display:'flex', alignItems:'center', gap:3, color:'#f97316' }}>
              <Icon.Flame />
              <p className={styles.statNum} style={{ color:'#f97316' }}>{habit.current_streak}</p>
            </div>
            <p className={styles.statSub}>streak</p>
          </div>
          <div className={styles.statBox}>
            <p className={styles.statNum} style={{ color: habit.color || '#6366f1' }}>
              {habit.completion_rate ?? 0}%
            </p>
            <p className={styles.statSub}>rate</p>
          </div>
          <div className={styles.statBox}>
            <p className={styles.statNum} style={{ color:'#10b981' }}>{habit.total_completions ?? 0}</p>
            <p className={styles.statSub}>total</p>
          </div>
        </div>

        {/* Last 7 days heatmap */}
        {habit.last_7_days && (
          <div className={styles.heatmap}>
            {habit.last_7_days.map((d, i) => (
              <div key={i} className={styles.heatCell}>
                <div className={styles.heatDot} style={{
                  background: d.completed ? (habit.color || '#6366f1') : '#f3f4f6',
                  border: `1.5px solid ${d.completed ? (habit.color || '#6366f1') : '#e5e7eb'}`,
                }} title={`${d.label}: ${d.completed ? 'Done' : 'Missed'}`} />
                <span className={styles.heatLabel}>{d.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Mark done button */}
        <button
          className={`${styles.markBtn} ${habit.today_completed ? styles.markBtnDone : ''}`}
          style={habit.today_completed
            ? { borderColor: habit.color || '#10b981', background: `${habit.color || '#10b981'}18`, color: habit.color || '#10b981' }
            : {}}
          onClick={() => onToggle(habit.id)}
        >
          {habit.today_completed
            ? <><Icon.Check /> Done today!</>
            : 'Mark as done'}
        </button>
      </div>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────── */
export default function Habits() {
  const [habits, setHabits]       = useState([])
  const [weekStats, setWeekStats] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editHabit, setEditHabit] = useState(null)
  const today = new Date().toISOString().slice(0, 10)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [hr, wr] = await Promise.all([habitsAPI.list(), habitsAPI.weeklyStats()])
      setHabits(hr.data.results ?? hr.data)
      setWeekStats(wr.data)
    } catch { toast.error('Failed to load habits') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const toggleHabit = async (id) => {
    try { await habitsAPI.log(id, { date: today }); load() }
    catch { toast.error('Failed to log') }
  }

  const deleteHabit = async (id) => {
    if (!window.confirm('Delete this habit?')) return
    try { await habitsAPI.delete(id); toast.success('Habit deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  const active    = habits.filter(h => h.is_active)
  const doneToday = active.filter(h => h.today_completed).length
  const donePct   = active.length ? Math.round((doneToday / active.length) * 100) : 0

  return (
    <div className="fade-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Habits</h1>
          <p style={{ color:'var(--text2)', fontSize:'0.875rem', marginTop:'0.2rem' }}>
            Build positive routines one day at a time.
          </p>
        </div>
        <button className="btn btn-primary"
          style={{ display:'flex', alignItems:'center', gap:6 }}
          onClick={() => { setEditHabit(null); setShowModal(true) }}>
          <Icon.Plus /> New Habit
        </button>
      </div>

      {/* Today banner */}
      {habits.length > 0 && (
        <div className={styles.todayBanner}>
          <div className={styles.ringWrap}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="21" fill="none" stroke="#f3f4f6" strokeWidth="5"/>
              <circle cx="26" cy="26" r="21" fill="none" stroke="#6366f1" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 21}`}
                strokeDashoffset={`${2 * Math.PI * 21 * (1 - donePct / 100)}`}
                strokeLinecap="round"
                style={{ transform:'rotate(-90deg)', transformOrigin:'center', transition:'stroke-dashoffset 0.6s ease' }}
              />
              <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="700" fill="#111827">{donePct}%</text>
            </svg>
          </div>
          <div>
            <p className={styles.todayTitle}>Today's Progress</p>
            <p className={styles.todaySub}>{doneToday} of {active.length} habits completed</p>
          </div>
          <div className={styles.todayPills}>
            {[
              { label: 'Total',   val: active.length },
              { label: 'Done',    val: doneToday },
              { label: 'Pending', val: active.length - doneToday },
            ].map(({ label, val }) => (
              <div key={label} className={styles.todayPill}>
                <span style={{ fontSize:'1rem', fontWeight:700, color:'#111827' }}>{val}</span>
                <span style={{ fontSize:'0.72rem', color:'#6b7280' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly chart */}
      {weekStats.length > 0 && (
        <div className="card" style={{ marginBottom:'1.25rem' }}>
          <p className={styles.chartTitle}>Weekly Overview</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={weekStats} barSize={26}>
              <XAxis dataKey="day" tick={{ fill:'#6b7280', fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip content={<CustomTooltip />} cursor={{ fill:'#6366f108' }}/>
              <Bar dataKey="completed" fill="#6366f1" radius={[5,5,0,0]} name="Done"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', paddingTop:'3rem' }}>
          <div className="spinner"/>
        </div>
      ) : habits.length === 0 ? (
        <div className={styles.empty}>
          <div style={{ color:'#d1d5db', marginBottom:'1rem' }}><Icon.Activity /></div>
          <p className={styles.emptyTitle}>No habits yet</p>
          <p className={styles.emptySub}>Build consistent routines by tracking them daily.</p>
          <button className="btn btn-primary"
            style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:'1.25rem' }}
            onClick={() => { setEditHabit(null); setShowModal(true) }}>
            <Icon.Plus /> Create First Habit
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {habits.map(h => (
            <HabitCard key={h.id} habit={h}
              onToggle={toggleHabit}
              onEdit={h => { setEditHabit(h); setShowModal(true) }}
              onDelete={deleteHabit}
            />
          ))}
        </div>
      )}

      {showModal && (
        <HabitModal
          habit={editHabit}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); load() }}
        />
      )}
    </div>
  )
}