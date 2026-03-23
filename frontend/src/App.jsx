import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Goals from './pages/Goals'
import GoalDetail from './pages/GoalDetail'
import Habits from './pages/Habits'
import Journal from './pages/Journal'
import JournalDetail from './pages/JournalDetail'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import LoadingScreen from './components/LoadingScreen'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  return children
}

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard"        element={<Dashboard />} />
        <Route path="/goals"            element={<Goals />} />
        <Route path="/goals/:id"        element={<GoalDetail />} />
        <Route path="/habits"           element={<Habits />} />
        <Route path="/journal"          element={<Journal />} />
        <Route path="/journal/:id"      element={<JournalDetail />} />
        <Route path="/profile"          element={<Profile />} />
      </Route>

      <Route path="/admin" element={<AdminRoute><Layout /></AdminRoute>}>
        <Route index element={<AdminPanel />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
