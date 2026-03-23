import { useEffect, useState, useCallback } from 'react'
import { dashboardAPI, authAPI, goalsAPI, habitsAPI } from '../api'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import toast from 'react-hot-toast'

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Goals: () => (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  ),
  Habits: () => (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),
  Journal: () => (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8 9h8M8 12h8M8 15h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Active: () => (
    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Refresh: () => (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M12 3l8 4v5c0 4.4-3.4 8.5-8 9.5C7.4 20.5 4 16.4 4 12V7l8-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

const STATUS_COLORS = {
  completed:   { bg: '#d1fae5', text: '#059669' },
  in_progress: { bg: '#e0e7ff', text: '#6366f1' },
  not_started: { bg: '#f1f5f9', text: '#64748b' },
  paused:      { bg: '#fef3c7', text: '#d97706' },
}

const PIE_COLORS = ['#10b981', '#6366f1', '#94a3b8', '#f59e0b']

const TABS = [
  { key: 'overview', label: 'Overview',        icon: Icon.Active },
  { key: 'users',    label: 'Users',            icon: Icon.Users  },
  { key: 'goals',    label: 'Goals',            icon: Icon.Goals  },
  { key: 'habits',   label: 'Habits',           icon: Icon.Habits },
]

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon: IconComp, trend }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 14,
      padding: '1.25rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* background tint */}
      <div style={{
        position: 'absolute', right: -10, top: -10,
        width: 70, height: 70, borderRadius: '50%',
        background: color + '18',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: color + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color,
        }}>
          <IconComp />
        </div>
        {trend !== undefined && (
          <span style={{
            fontSize: '0.72rem', fontWeight: 600,
            color: trend >= 0 ? '#059669' : '#dc2626',
            background: trend >= 0 ? '#d1fae5' : '#fee2e2',
            padding: '0.15rem 0.5rem', borderRadius: 20,
          }}>
            {trend >= 0 ? '+' : ''}{trend} this week
          </span>
        )}
      </div>
      <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#0f172a', lineHeight: 1 }}>
        {value ?? '—'}
      </div>
      {sub && <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{sub}</div>}
    </div>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ first, last, size = 34 }) {
  const colors = ['#6366f1','#10b981','#f59e0b','#3b82f6','#8b5cf6','#ef4444']
  const color = colors[((first?.charCodeAt(0) || 0) + (last?.charCodeAt(0) || 0)) % colors.length]
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.28, fontWeight: 700, color: '#fff',
      textTransform: 'uppercase', flexShrink: 0,
      letterSpacing: '0.03em',
    }}>
      {first?.[0]}{last?.[0]}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [data,    setData]    = useState(null)
  const [users,   setUsers]   = useState([])
  const [goals,   setGoals]   = useState([])
  const [habits,  setHabits]  = useState([])
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('overview')
  const [search,  setSearch]  = useState('')

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [dr, ur, gr, hr] = await Promise.all([
        dashboardAPI.admin(),
        authAPI.adminUsers(),
        goalsAPI.adminAll(),
        habitsAPI.adminAll(),
      ])
      setData(dr.data)
      setUsers(ur.data.results || ur.data)
      setGoals(gr.data.results || gr.data)
      setHabits(hr.data.results || hr.data)
    } catch { toast.error('Failed to load admin data') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  const toggleUser = async (id, is_active) => {
    try {
      await authAPI.adminToggleUser(id, { is_active: !is_active })
      toast.success(is_active ? 'User deactivated' : 'User activated')
      loadAll()
    } catch { toast.error('Failed to update user') }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
      <div className="spinner" />
    </div>
  )

  const { stats, goals_by_status, recent_users } = data || {}

  const pieData = goals_by_status
    ?.filter(g => g.count > 0)
    .map((g, i) => ({ name: g.status.replace('_', ' '), value: g.count, color: PIE_COLORS[i % PIE_COLORS.length] })) || []

  // filtered lists
  const q = search.toLowerCase()
  const filteredUsers  = users.filter(u =>
    `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(q))
  const filteredGoals  = goals.filter(g =>
    `${g.title} ${g.user_name}`.toLowerCase().includes(q))
  const filteredHabits = habits.filter(h =>
    `${h.name} ${h.user}`.toLowerCase().includes(q))

  return (
    <div className="fade-up">
      {/* Page header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
          }}>
            <Icon.Shield />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              Admin Panel
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Platform overview & management</p>
          </div>
        </div>
        <button
          onClick={loadAll}
          className="btn btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Icon.Refresh /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '0.35rem',
        background: '#f1f5f9', borderRadius: 12,
        padding: '0.35rem', marginBottom: '1.75rem',
        width: 'fit-content',
      }}>
        {TABS.map(({ key, label, icon: TabIcon }) => (
          <button key={key} onClick={() => { setTab(key); setSearch('') }} style={{
            display: 'flex', alignItems: 'center', gap: '0.45rem',
            padding: '0.5rem 1rem',
            borderRadius: 9,
            background: tab === key ? '#fff' : 'transparent',
            color: tab === key ? '#6366f1' : '#64748b',
            fontWeight: tab === key ? 600 : 500,
            fontSize: '0.85rem',
            border: 'none',
            boxShadow: tab === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.18s',
            cursor: 'pointer',
          }}>
            <TabIcon />
            {label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <>
          <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
            <StatCard label="Total Users"   value={stats?.total_users}   sub={`${stats?.active_users} active`}      color="#6366f1" icon={Icon.Users}   trend={stats?.new_users_this_week} />
            <StatCard label="Total Goals"   value={stats?.total_goals}   sub={`${stats?.completed_goals} completed`} color="#10b981" icon={Icon.Goals}   />
            <StatCard label="Total Habits"  value={stats?.total_habits}  sub="across all users"                      color="#f59e0b" icon={Icon.Habits}  />
            <StatCard label="Journal Entries" value={stats?.total_journals} sub="total entries"                      color="#3b82f6" icon={Icon.Journal} />
          </div>

          <div className="grid-2">
            {/* Pie chart */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: '1rem' }}>
                Goals by Status
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.78rem', color: '#64748b' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Recent users */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: '1rem' }}>
                Recent Users
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {recent_users?.map(u => (
                  <div key={u.id} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.6rem 0.75rem',
                    background: '#f8fafc', borderRadius: 10,
                    border: '1px solid #f1f5f9',
                  }}>
                    <Avatar first={u.first_name} last={u.last_name} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                        {u.first_name} {u.last_name}
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {u.email}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: 20,
                      background: u.role === 'admin' ? '#e0e7ff' : '#f1f5f9',
                      color: u.role === 'admin' ? '#6366f1' : '#64748b',
                    }}>{u.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── USERS ── */}
      {tab === 'users' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
              User Management <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.82rem' }}>({filteredUsers.length})</span>
            </div>
            <SearchBox value={search} onChange={setSearch} placeholder="Search users…" />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No users found</td></tr>
                )}
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Avatar first={u.first_name} last={u.last_name} size={30} />
                        <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.88rem' }}>{u.first_name} {u.last_name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{u.email}</td>
                    <td>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.65rem', borderRadius: 20,
                        background: u.role === 'admin' ? '#e0e7ff' : '#f1f5f9',
                        color: u.role === 'admin' ? '#6366f1' : '#64748b',
                      }}>{u.role}</span>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.65rem', borderRadius: 20,
                        background: u.is_active ? '#d1fae5' : '#fee2e2',
                        color: u.is_active ? '#059669' : '#dc2626',
                      }}>{u.is_active ? 'Active' : 'Disabled'}</span>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{u.date_joined?.slice(0, 10)}</td>
                    <td>
                      <button
                        onClick={() => toggleUser(u.id, u.is_active)}
                        style={{
                          padding: '0.3rem 0.8rem', fontSize: '0.75rem', fontWeight: 600,
                          borderRadius: 7, border: '1.5px solid',
                          cursor: 'pointer', transition: 'all 0.18s',
                          background: u.is_active ? '#fff5f5' : '#f0fdf4',
                          color: u.is_active ? '#ef4444' : '#10b981',
                          borderColor: u.is_active ? '#fca5a5' : '#6ee7b7',
                        }}
                      >
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── GOALS ── */}
      {tab === 'goals' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
              All Goals <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.82rem' }}>({filteredGoals.length})</span>
            </div>
            <SearchBox value={search} onChange={setSearch} placeholder="Search goals…" />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Title</th><th>User</th><th>Status</th><th>Priority</th><th>Progress</th><th>Created</th></tr>
              </thead>
              <tbody>
                {filteredGoals.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No goals found</td></tr>
                )}
                {filteredGoals.map(g => {
                  const sc = STATUS_COLORS[g.status] || STATUS_COLORS.not_started
                  return (
                    <tr key={g.id}>
                      <td style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.88rem', maxWidth: 200 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.title}</div>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{g.user_name}</td>
                      <td>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.65rem', borderRadius: 20, background: sc.bg, color: sc.text }}>
                          {g.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.65rem', borderRadius: 20,
                          background: g.priority === 'high' ? '#fee2e2' : g.priority === 'medium' ? '#fef3c7' : '#f1f5f9',
                          color: g.priority === 'high' ? '#dc2626' : g.priority === 'medium' ? '#d97706' : '#64748b',
                        }}>{g.priority}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 120 }}>
                          <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${g.progress}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 99, transition: 'width 0.5s' }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, minWidth: 32 }}>{g.progress}%</span>
                        </div>
                      </td>
                      <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{g.created_at?.slice(0, 10)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── HABITS ── */}
      {tab === 'habits' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
              All Habits <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.82rem' }}>({filteredHabits.length})</span>
            </div>
            <SearchBox value={search} onChange={setSearch} placeholder="Search habits…" />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Habit</th><th>User</th><th>Frequency</th><th>Current Streak</th><th>Total Done</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filteredHabits.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No habits found</td></tr>
                )}
                {filteredHabits.map(h => (
                  <tr key={h.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: h.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                          {h.icon}
                        </div>
                        <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.88rem' }}>{h.name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{h.user}</td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 500, textTransform: 'capitalize', color: '#475569' }}>{h.frequency}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: h.current_streak > 0 ? '#f59e0b' : '#e2e8f0' }} />
                        <span style={{ fontWeight: 700, color: h.current_streak > 0 ? '#d97706' : '#94a3b8', fontSize: '0.88rem' }}>
                          {h.current_streak} days
                        </span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#475569', fontSize: '0.88rem' }}>{h.total_completions}</td>
                    <td>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.65rem', borderRadius: 20,
                        background: h.is_active ? '#d1fae5' : '#f1f5f9',
                        color: h.is_active ? '#059669' : '#94a3b8',
                      }}>{h.is_active ? 'Active' : 'Inactive'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Search Box ───────────────────────────────────────────────────────────────
function SearchBox({ value, onChange, placeholder }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <span style={{ position: 'absolute', left: '0.65rem', color: '#94a3b8', pointerEvents: 'none', display: 'flex' }}>
        <Icon.Search />
      </span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          paddingLeft: '2.1rem', paddingRight: '0.85rem',
          paddingTop: '0.5rem', paddingBottom: '0.5rem',
          background: '#f8fafc', border: '1.5px solid #e2e8f0',
          borderRadius: 9, fontSize: '0.83rem', color: '#1e293b',
          width: 220, outline: 'none', transition: 'border-color 0.18s',
          fontFamily: "'DM Sans', sans-serif",
        }}
        onFocus={e => e.target.style.borderColor = '#6366f1'}
        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
      />
    </div>
  )
}