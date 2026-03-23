import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { authAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

/* ── SVG Icons ──────────────────────────────────────────── */
const IcUser    = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>)
const IcLock    = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>)
const IcSettings= () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>)
const IcCamera  = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>)
const IcSave    = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>)
const IcMail    = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>)
const IcCalendar= () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>)
const IcShield  = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>)
const IcFlame   = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c2.76 0 5-2.24 5-5 0-1.59-.44-2.51-1.5-3.5-1 1-1.5 1.5-2 1.5s-.5-1.5.5-2.5c-2 1-3 3-2.5 5-.5-.5-.5-1.5 0-2.5-1.5 1-2 2.5-2 4z"/></svg>)
const IcStar    = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)
const IcEye     = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>)
const IcEyeOff  = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>)
const IcChevDown= () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>)

/* ── Shared CSS-in-JS helpers ───────────────────────────── */
const inp = (err) => ({
  width: '100%', height: 38, padding: '0 12px',
  border: `1px solid ${err ? '#ef4444' : '#e5e7eb'}`,
  borderRadius: 8, fontSize: '0.875rem', fontFamily: 'inherit',
  color: '#111827', background: '#fff', outline: 'none',
  transition: 'border-color 0.15s',
})
const LBL = { fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }
const FLD = { display: 'flex', flexDirection: 'column' }

/* ── Password input with show/hide ─────────────────────── */
function PwdInput({ placeholder, registration, error }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        style={{ ...inp(error), paddingRight: 38 }}
        {...registration}
      />
      <button type="button" onClick={() => setShow(s => !s)}
        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', padding: 2 }}>
        {show ? <IcEyeOff /> : <IcEye />}
      </button>
    </div>
  )
}

/* ── Avatar ─────────────────────────────────────────────── */
function Avatar({ user, size = 72, preview }) {
  const initials = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'
  const colors   = ['#6366f1','#10b981','#f59e0b','#3b82f6','#ec4899']
  const color    = colors[(user?.id ?? 0) % colors.length]

  if (preview || user?.avatar) return (
    <img src={preview || user.avatar} alt="Avatar"
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
  )
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.32, fontWeight: 700, color: '#fff',
      fontFamily: 'var(--font-display,"Syne",sans-serif)',
    }}>
      {initials}
    </div>
  )
}

/* ── Stat pill ──────────────────────────────────────────── */
function StatPill({ icon: Ic, value, label, color }) {
  return (
    <div style={{ textAlign: 'center', padding: '10px 18px', background: color + '12', borderRadius: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, color, marginBottom: 3 }}>
        <Ic />
        <span style={{ fontFamily: 'var(--font-display,"Syne",sans-serif)', fontSize: '1.25rem', fontWeight: 800 }}>{value}</span>
      </div>
      <p style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 500 }}>{label}</p>
    </div>
  )
}

/* ── Info row ───────────────────────────────────────────── */
function InfoRow({ icon: Ic, label: lbl, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#6b7280' }}>
        <Ic /> {lbl}
      </span>
      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#111827' }}>{value || '—'}</span>
    </div>
  )
}

/* ── Section heading ────────────────────────────────────── */
function SectionHead({ title }) {
  return (
    <p style={{ fontFamily: 'var(--font-display,"Syne",sans-serif)', fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: '1.1rem' }}>
      {title}
    </p>
  )
}

/* ── Main ───────────────────────────────────────────────── */
export default function Profile() {
  const { user, updateUser } = useAuth()
  const [profile, setProfile]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [tab, setTab]               = useState('profile')  // 'profile' | 'settings' | 'password'
  const [avatarPreview, setPreview] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const fileRef = useRef()

  /* ── Forms ── */
  const {
    register: rName, handleSubmit: subName,
    formState: { isSubmitting: savingName },
  } = useForm()

  const {
    register: rProf, handleSubmit: subProf,
    reset: resetProf,
    formState: { isSubmitting: savingProf },
  } = useForm()

  const {
    register: rPwd, handleSubmit: subPwd, reset: resetPwd,
    watch: watchPwd,
    formState: { errors: errPwd, isSubmitting: savingPwd },
  } = useForm()

  const {
    register: rSet, handleSubmit: subSet,
    reset: resetSet,
    formState: { isSubmitting: savingSet },
  } = useForm()

  /* ── Load ── */
  useEffect(() => {
    authAPI.profile()
      .then(({ data }) => {
        setProfile(data)
        resetProf({
          bio:              data.bio,
          motivation_quote: data.motivation_quote,
          date_of_birth:    data.date_of_birth ?? '',
        })
        resetSet({
          timezone:           data.timezone ?? 'Asia/Kolkata',
          weekly_goal_target: data.weekly_goal_target ?? 5,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  /* ── Handlers ── */
  const onUpdateName = async (data) => {
    try {
      const r = await authAPI.updateMe(data)
      updateUser?.(r.data)
      toast.success('Name updated')
    } catch { toast.error('Update failed') }
  }

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const onUpdateProfile = async (data) => {
    try {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => { if (v !== '' && v != null) fd.append(k, v) })
      if (avatarFile) fd.append('avatar', avatarFile)
      await authAPI.updateProfile(fd)
      toast.success('Profile updated')
    } catch { toast.error('Update failed') }
  }

  const onUpdateSettings = async (data) => {
    try {
      await authAPI.updateProfile(data)
      toast.success('Settings saved')
    } catch { toast.error('Failed to save') }
  }

  const onChangePassword = async (data) => {
    try {
      await authAPI.changePassword(data)
      toast.success('Password changed')
      resetPwd()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password')
    }
  }

  /* ── Loading ── */
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
      <div className="spinner" />
    </div>
  )

  const fullName = `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() || user?.email

  return (
    <div className="fade-up" style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* ── Hero card ── */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1.5rem 1.75rem' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Avatar user={user} size={76} preview={avatarPreview} />
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 26, height: 26, borderRadius: '50%',
                background: '#6366f1', border: '2px solid #fff',
                color: '#fff', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
              title="Change photo">
              <IcCamera />
            </button>
            <input ref={fileRef} type="file" accept="image/*"
              style={{ display: 'none' }} onChange={onAvatarChange} />
          </div>

          {/* Name + meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              <h1 style={{ fontFamily: 'var(--font-display,"Syne",sans-serif)', fontSize: '1.35rem', fontWeight: 800, color: '#111827' }}>
                {fullName}
              </h1>
              <span style={{
                fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 99,
                background: user?.role === 'admin' ? '#eff6ff' : '#f0fdf4',
                color: user?.role === 'admin' ? '#3b82f6' : '#10b981',
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <IcShield /> {user?.role ?? 'user'}
                </span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: 10 }}>{user?.email}</p>
            {profile?.bio && (
              <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.6, fontStyle: 'italic' }}>
                "{profile.bio}"
              </p>
            )}
          </div>

          {/* Stats */}
          {(profile?.streak_days != null || profile?.total_xp != null) && (
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              {profile.streak_days != null && (
                <StatPill icon={IcFlame} value={profile.streak_days} label="streak days" color="#f97316" />
              )}
              {profile.total_xp != null && (
                <StatPill icon={IcStar} value={profile.total_xp} label="total XP" color="#6366f1" />
              )}
            </div>
          )}
        </div>

        {/* Quick name form */}
        <form onSubmit={subName(onUpdateName)}>
          <div style={{ height: 1, background: '#f3f4f6', margin: '1.25rem 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem' }}>
            <div style={FLD}>
              <label style={LBL}>First name</label>
              <input style={inp(false)} defaultValue={user?.first_name}
                {...rName('first_name', { required: true })} />
            </div>
            <div style={FLD}>
              <label style={LBL}>Last name</label>
              <input style={inp(false)} defaultValue={user?.last_name}
                {...rName('last_name', { required: true })} />
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
              disabled={savingName}>
              <IcSave /> {savingName ? 'Saving…' : 'Update Name'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Tab bar ── */}
      <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', borderRadius: 10, padding: 4, marginBottom: '1.1rem' }}>
        {[
          { key: 'profile',  label: 'Profile',  Ic: IcUser     },
          { key: 'settings', label: 'Settings', Ic: IcSettings },
          { key: 'password', label: 'Password', Ic: IcLock     },
        ].map(({ key, label, Ic }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            padding: '9px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 600,
            background: tab === key ? '#fff' : 'transparent',
            color: tab === key ? '#6366f1' : '#6b7280',
            boxShadow: tab === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s',
          }}>
            <Ic /> {label}
          </button>
        ))}
      </div>

      {/* ── Profile tab ── */}
      {tab === 'profile' && (
        <div className="card" style={{ padding: '1.5rem 1.75rem' }}>
          <SectionHead title="Profile Details" />

          <form onSubmit={subProf(onUpdateProfile)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Bio */}
            <div style={FLD}>
              <label style={LBL}>Bio</label>
              <textarea
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '0.875rem', fontFamily: 'inherit', color: '#111827', background: '#fff', outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
                rows={3}
                placeholder="Tell us about yourself and your growth journey…"
                {...rProf('bio')}
              />
            </div>

            {/* Motivation quote */}
            <div style={FLD}>
              <label style={LBL}>Motivation Quote <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span></label>
              <input style={inp(false)} placeholder="Your go-to motivational quote…" {...rProf('motivation_quote')} />
            </div>

            {/* Date of birth */}
            <div style={FLD}>
              <label style={LBL}>Date of Birth</label>
              <input type="date" style={inp(false)} {...rProf('date_of_birth')} />
            </div>

            {/* Account info read-only */}
            <div style={{ background: '#f9fafb', borderRadius: 10, padding: '0.75rem 1rem', marginTop: 4 }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Account info</p>
              <InfoRow icon={IcMail}     label="Email"   value={user?.email} />
              <InfoRow icon={IcCalendar} label="Joined"  value={profile?.date_joined?.slice(0, 10) ?? user?.date_joined?.slice(0, 10)} />
              <InfoRow icon={IcShield}   label="Role"    value={user?.role} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
              <button type="submit" className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
                disabled={savingProf}>
                <IcSave /> {savingProf ? 'Saving…' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Settings tab ── */}
      {tab === 'settings' && (
        <div className="card" style={{ padding: '1.5rem 1.75rem' }}>
          <SectionHead title="Preferences" />

          <form onSubmit={subSet(onUpdateSettings)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Timezone */}
            <div style={FLD}>
              <label style={LBL}>Timezone</label>
              <div style={{ position: 'relative' }}>
                <select style={{ ...inp(false), paddingRight: 32, appearance: 'none', cursor: 'pointer' }}
                  {...rSet('timezone')}>
                  <option value="Asia/Kolkata">India — IST (UTC+5:30)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">US Eastern (UTC-5)</option>
                  <option value="America/Chicago">US Central (UTC-6)</option>
                  <option value="America/Los_Angeles">US Pacific (UTC-8)</option>
                  <option value="Europe/London">UK — GMT</option>
                  <option value="Europe/Paris">Central Europe (UTC+1)</option>
                  <option value="Asia/Singapore">Singapore (UTC+8)</option>
                  <option value="Asia/Tokyo">Japan (UTC+9)</option>
                  <option value="Australia/Sydney">Sydney (UTC+11)</option>
                </select>
                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none', display: 'flex' }}>
                  <IcChevDown />
                </span>
              </div>
            </div>

            {/* Weekly goal target */}
            <div style={FLD}>
              <label style={LBL}>Weekly Goal Target</label>
              <input type="number" min={1} max={30} style={inp(false)}
                placeholder="e.g. 5"
                {...rSet('weekly_goal_target')} />
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 4 }}>
                How many goals do you aim to make progress on each week?
              </p>
            </div>

            {/* Notifications (UI only) */}
            <div style={{ background: '#f9fafb', borderRadius: 10, padding: '1rem 1.1rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 10 }}>Notifications</p>
              {[
                { key: 'notify_daily',   label: 'Daily reminder',      sub: 'Get a reminder to log habits each day' },
                { key: 'notify_weekly',  label: 'Weekly summary',      sub: 'Receive a summary of your week\'s progress' },
                { key: 'notify_streak',  label: 'Streak alerts',       sub: 'Be notified when a streak is at risk' },
              ].map(n => (
                <label key={n.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10, cursor: 'pointer' }}>
                  <input type="checkbox" {...rSet(n.key)}
                    style={{ marginTop: 2, accentColor: '#6366f1', width: 15, height: 15, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 1 }}>{n.label}</p>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{n.sub}</p>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
                disabled={savingSet}>
                <IcSave /> {savingSet ? 'Saving…' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Password tab ── */}
      {tab === 'password' && (
        <div className="card" style={{ padding: '1.5rem 1.75rem' }}>
          <SectionHead title="Change Password" />

          {/* Security note */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 14px', marginBottom: '1.25rem', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ color: '#3b82f6', display: 'flex', flexShrink: 0, marginTop: 1 }}><IcShield /></span>
            <p style={{ fontSize: '0.8rem', color: '#1e40af', lineHeight: 1.5 }}>
              Choose a strong password of at least 8 characters. We recommend mixing letters, numbers, and symbols.
            </p>
          </div>

          <form onSubmit={subPwd(onChangePassword)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={FLD}>
              <label style={LBL}>Current Password</label>
              <PwdInput placeholder="Enter your current password"
                registration={rPwd('old_password', { required: 'Required' })}
                error={errPwd.old_password} />
              {errPwd.old_password && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 3 }}>{errPwd.old_password.message}</p>}
            </div>

            <div style={FLD}>
              <label style={LBL}>New Password</label>
              <PwdInput placeholder="At least 8 characters"
                registration={rPwd('new_password', { required: 'Required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
                error={errPwd.new_password} />
              {errPwd.new_password && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 3 }}>{errPwd.new_password.message}</p>}
            </div>

            {/* Password strength bar */}
            {watchPwd('new_password') && (
              <PasswordStrength password={watchPwd('new_password')} />
            )}

            <div style={FLD}>
              <label style={LBL}>Confirm New Password</label>
              <PwdInput placeholder="Repeat your new password"
                registration={rPwd('new_password2', {
                  required: 'Required',
                  validate: v => v === watchPwd('new_password') || 'Passwords do not match',
                })}
                error={errPwd.new_password2} />
              {errPwd.new_password2 && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 3 }}>{errPwd.new_password2.message}</p>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
              <button type="submit" className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
                disabled={savingPwd}>
                <IcLock /> {savingPwd ? 'Changing…' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

/* ── Password strength meter ────────────────────────────── */
function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ chars',        pass: password.length >= 8      },
    { label: 'Uppercase',       pass: /[A-Z]/.test(password)    },
    { label: 'Number',          pass: /\d/.test(password)       },
    { label: 'Symbol',          pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const score  = checks.filter(c => c.pass).length
  const colors = ['#ef4444','#f97316','#f59e0b','#22c55e']
  const labels = ['Weak','Fair','Good','Strong']
  const color  = colors[score - 1] ?? '#e5e7eb'
  const label  = labels[score - 1] ?? ''

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 99,
            background: i <= score ? color : '#f3f4f6',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {checks.map(c => (
            <span key={c.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              fontSize: '0.7rem', fontWeight: 500,
              color: c.pass ? '#10b981' : '#9ca3af',
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                {c.pass ? <polyline points="20 6 9 17 4 12"/> : <line x1="18" y1="6" x2="6" y2="18"/>}
              </svg>
              {c.label}
            </span>
          ))}
        </div>
        {label && <span style={{ fontSize: '0.75rem', fontWeight: 700, color }}>{label}</span>}
      </div>
    </div>
  )
}