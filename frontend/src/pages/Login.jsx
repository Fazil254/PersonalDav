import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await login(data)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0] || 'Invalid email or password.'
      toast.error(msg)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
      </div>

      <div className={styles.card}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
              <path d="M12 2l2.8 6.3H22l-5.9 4.3 2.2 6.8L12 15.5l-6.3 3.9 2.2-6.8L2 8.3h7.2L12 2z"/>
            </svg>
          </div>
          <span className={styles.brandName}>PersonalDev</span>
        </div>

        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.sub}>Sign in to continue your growth journey</p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@email.com"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Enter your password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Signing in…
                </span>
              : 'Sign In'
            }
          </button>
        </form>

        <p className={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.link}>Create one free</Link>
        </p>
      </div>
    </div>
  )
}