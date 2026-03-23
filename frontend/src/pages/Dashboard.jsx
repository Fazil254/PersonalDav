import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { dashboardAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import styles from './Dashboard.module.css'

/* ── SVG Icon Components ─────────────────────────────────── */
const Icon = {
  Target: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Flame: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c2.76 0 5-2.24 5-5 0-1.59-.44-2.51-1.5-3.5-1 1-1.5 1.5-2 1.5s-.5-1.5.5-2.5c-2 1-3 3-2.5 5-.5-.5-.5-1.5 0-2.5-1.5 1-2 2.5-2 4z"/>
    </svg>
  ),
  BookOpen: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  TrendUp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  SmileFace: ({ mood }) => {
    if (mood >= 4) return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    )
    if (mood === 3) return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    )
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    )
  },
}

/* ── Status config ───────────────────────────────────────── */
const STATUS_MAP = {
  completed:   { label: 'Completed',   cls: 'badge-green' },
  in_progress: { label: 'In Progress', cls: 'badge-blue'  },
  not_started: { label: 'Not Started', cls: 'badge-gray'  },
  paused:      { label: 'Paused',      cls: 'badge-amber' },
}

const CHART_COLORS = ['#10b981', '#6366f1', '#94a3b8', '#f59e0b']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb',
      borderRadius: 8, padding: '8px 12px', fontSize: 12,
    }}>
      <p style={{ fontWeight: 600, color: '#111827', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill || p.color, margin: '2px 0' }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

/* ── Stat card ───────────────────────────────────────────── */
function StatCard({ icon: IconComp, label, primary, sub, accent }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ color: accent, background: `${accent}14` }}>
        <IconComp />
      </div>
      <div className={styles.statBody}>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue} style={{ color: accent }}>{primary}</p>
        {sub && <p className={styles.statSub}>{sub}</p>}
      </div>
    </div>
  )
}

/* ── Main component ──────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardAPI.user()
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className={styles.center}>
      <div className="spinner" />
    </div>
  )

  const {
    goals, habits, journal,
    weekly_habit_chart = [],
    goal_status_chart  = [],
    recent_goals       = [],
    recent_journals    = [],
  } = data || {}

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <div className="fade-up">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{greeting}, {user?.first_name || 'there'}</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Here's what's happening with your growth today.
          </p>
        </div>
        <Link to="/goals" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon.Plus /> New Goal
        </Link>
      </div>

      {/* ── Stat cards ── */}
      <div className={styles.statsGrid}>
        <StatCard
          icon={Icon.Target} label="Total Goals" accent="#6366f1"
          primary={goals?.total ?? 0}
          sub={`${goals?.completed ?? 0} completed`}
        />
        <StatCard
          icon={Icon.Flame} label="Habits Today" accent="#10b981"
          primary={`${habits?.today_completed ?? 0} / ${habits?.today_total ?? 0}`}
          sub="completed today"
        />
        <StatCard
          icon={Icon.BookOpen} label="Journal Entries" accent="#f59e0b"
          primary={journal?.total_entries ?? 0}
          sub={`${journal?.this_week ?? 0} this week`}
        />
        <StatCard
          icon={Icon.TrendUp} label="Avg Progress" accent="#3b82f6"
          primary={`${goals?.avg_progress ?? 0}%`}
          sub="across all goals"
        />
      </div>

      {/* ── Charts ── */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Habit bar chart */}
        <div className="card">
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Weekly Habits</h3>
            <Link to="/habits" className={styles.viewLink}>
              View all <Icon.ArrowRight />
            </Link>
          </div>
          {weekly_habit_chart.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weekly_habit_chart} barGap={4} barSize={22}>
                <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#6366f108' }} />
                <Bar dataKey="completed" name="Completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total"     name="Total"     fill="#e5e7eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyChart message="No habit data yet" />}
        </div>

        {/* Goal donut */}
        <div className="card">
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Goal Status</h3>
            <Link to="/goals" className={styles.viewLink}>
              View all <Icon.ArrowRight />
            </Link>
          </div>
          {goal_status_chart.some(d => d.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={goal_status_chart.filter(d => d.value > 0)}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={78}
                    paddingAngle={4} dataKey="value"
                    startAngle={90} endAngle={-270}
                  >
                    {goal_status_chart.map((entry, i) => (
                      <Cell key={i} fill={entry.color || CHART_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.legend}>
                {goal_status_chart.map((item, i) => (
                  <span key={i} className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: item.color || CHART_COLORS[i] }} />
                    {item.name} ({item.value})
                  </span>
                ))}
              </div>
            </>
          ) : <EmptyChart message="No goals yet" />}
        </div>
      </div>

      {/* ── Recent rows ── */}
      <div className="grid-2">
        {/* Recent Goals */}
        <div className="card">
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Recent Goals</h3>
            <Link to="/goals" className={styles.viewLink}>
              View all <Icon.ArrowRight />
            </Link>
          </div>
          {recent_goals.length === 0 ? (
            <EmptyList message="No goals yet." cta="Create one" ctaTo="/goals" />
          ) : (
            <div className={styles.listStack}>
              {recent_goals.map(g => (
                <Link to={`/goals/${g.id}`} key={g.id} className={styles.listRow}>
                  <div className={styles.listRowTop}>
                    <span className={styles.listRowTitle}>{g.title}</span>
                    <span className={`badge ${STATUS_MAP[g.status]?.cls || 'badge-gray'}`}>
                      {STATUS_MAP[g.status]?.label || g.status}
                    </span>
                  </div>
                  <div className="progress-bar" style={{ margin: '6px 0 4px' }}>
                    <div className="progress-fill" style={{ width: `${g.progress}%` }} />
                  </div>
                  <span style={{ fontSize: '0.73rem', color: '#9ca3af' }}>{g.progress}%</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Journal */}
        <div className="card">
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Recent Journal</h3>
            <Link to="/journal" className={styles.viewLink}>
              View all <Icon.ArrowRight />
            </Link>
          </div>
          {recent_journals.length === 0 ? (
            <EmptyList message="No journal entries yet." cta="Write one" ctaTo="/journal" />
          ) : (
            <div className={styles.listStack}>
              {recent_journals.map(j => (
                <Link to={`/journal/${j.id}`} key={j.id} className={styles.listRow}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span className={styles.moodIcon} style={{
                      color: j.mood >= 4 ? '#10b981' : j.mood === 3 ? '#f59e0b' : '#ef4444',
                    }}>
                      <Icon.SmileFace mood={j.mood} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className={styles.listRowTitle} style={{ marginBottom: 2 }}>{j.title}</p>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{j.created_at}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Helpers ─────────────────────────────────────────────── */
function EmptyChart({ message }) {
  return (
    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{message}</p>
    </div>
  )
}

function EmptyList({ message, cta, ctaTo }) {
  return (
    <p style={{ color: '#9ca3af', fontSize: '0.875rem', padding: '0.5rem 0' }}>
      {message}{' '}
      {cta && <Link to={ctaTo} style={{ color: '#6366f1', fontWeight: 500 }}>{cta} →</Link>}
    </p>
  )
}