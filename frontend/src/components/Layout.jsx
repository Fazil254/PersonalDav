import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './Layout.module.css'

const Icons = {
  Dashboard: (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),
  Goals: (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  ),
  Habits: (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Journal: (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8 9h8M8 12h8M8 15h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Profile: (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Admin: (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
      <path d="M12 3l8 4v5c0 4.4-3.4 8.5-8 9.5C7.4 20.5 4 16.4 4 12V7l8-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Logout: (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Menu: (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Logo: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M12 2l2.8 6.3H22l-5.9 4.3 2.2 6.8L12 15.5l-6.3 3.9 2.2-6.8L2 8.3h7.2L12 2z"/>
    </svg>
  ),
}

const NAV = [
  { to: '/dashboard', icon: Icons.Dashboard, label: 'Dashboard' },
  { to: '/goals',     icon: Icons.Goals,     label: 'Goals' },
  { to: '/habits',    icon: Icons.Habits,    label: 'Habits' },
  { to: '/journal',   icon: Icons.Journal,   label: 'Journal' },
  { to: '/profile',   icon: Icons.Profile,   label: 'Profile' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className={styles.shell}>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>{Icons.Logo}</span>
          <span className={styles.logoText}>PersonalDev</span>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to} to={to}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className={styles.navIcon}>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className={styles.navIcon}>{Icons.Admin}</span>
              <span>Admin</span>
            </NavLink>
          )}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.userChip}>
            <div className={styles.avatar}>
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.first_name} {user?.last_name}</span>
              <span className={styles.userRole}>{user?.role}</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            {Icons.Logout}
            Logout
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {Icons.Menu}
          </button>
          <div className={styles.headerRight}>
            <span className={styles.greeting}>Hello, {user?.first_name}</span>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}