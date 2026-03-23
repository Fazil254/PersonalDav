export default function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f4f8',
      gap: '2rem',
    }}>

      {/* Logo mark */}
      <div style={{
        width: 64, height: 64,
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        borderRadius: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
        animation: 'pulse 2s ease-in-out infinite',
      }}>
        <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
          <path d="M12 2l2.8 6.3H22l-5.9 4.3 2.2 6.8L12 15.5l-6.3 3.9 2.2-6.8L2 8.3h7.2L12 2z"/>
        </svg>
      </div>

      {/* Text + dots */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '1.25rem',
          fontWeight: 800,
          color: '#1e293b',
          letterSpacing: '-0.02em',
        }}>
          PersonalDev
        </span>
        <span style={{
          fontSize: '0.82rem',
          color: '#94a3b8',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Loading your workspace…
        </span>
      </div>

      {/* Animated dots */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8,
            borderRadius: '50%',
            background: '#6366f1',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            opacity: 0.7,
          }} />
        ))}
      </div>

      {/* Progress bar */}
      <div style={{
        width: 180,
        height: 3,
        background: '#e2e8f0',
        borderRadius: 99,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
          borderRadius: 99,
          animation: 'progress 1.8s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 24px rgba(99,102,241,0.3); }
          50%       { transform: scale(1.06); box-shadow: 0 12px 32px rgba(99,102,241,0.45); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40%            { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes progress {
          0%   { width: 0%;   margin-left: 0%; }
          50%  { width: 70%;  margin-left: 15%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}