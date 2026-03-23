import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await registerUser(data)
      toast.success('Account created! Welcome aboard!')
      navigate('/dashboard')
    } catch (err) {
      const errData = err.response?.data
      const msg = errData?.email?.[0] || errData?.password?.[0] || 'Registration failed.'
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

        <h1 className={styles.title}>Create account</h1>
        <p className={styles.sub}>Start your personal development journey today</p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.85rem' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                className="form-input"
                placeholder="John"
                {...register('first_name', { required: 'Required' })}
              />
              {errors.first_name && <span className="form-error">{errors.first_name.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                className="form-input"
                placeholder="Doe"
                {...register('last_name', { required: 'Required' })}
              />
              {errors.last_name && <span className="form-error">{errors.last_name.message}</span>}
            </div>
          </div>

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
              placeholder="Minimum 8 characters"
              {...register('password', {
                required: 'Required',
                minLength: { value: 8, message: 'At least 8 characters' }
              })}
            />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Repeat your password"
              {...register('password2', {
                required: 'Required',
                validate: v => v === watch('password') || 'Passwords do not match',
              })}
            />
            {errors.password2 && <span className="form-error">{errors.password2.message}</span>}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Creating account…
                </span>
              : 'Create Account'
            }
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}