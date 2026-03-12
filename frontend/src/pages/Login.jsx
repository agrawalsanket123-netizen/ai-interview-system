import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import BASE_URL from '../api'
import { useAuth } from '../AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true); setError('')
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password })
      login(res.data.user, res.data.access_token)
      navigate('/')
    } catch { setError('Invalid email or password') }
    setLoading(false)
  }

  return (
    <div style={s.page} className="page-enter">
      <div style={s.left}>
        <div style={s.leftGlow} />
        <div style={s.leftContent}>
          <div style={s.brand}>
            <div style={s.brandIcon}>AI</div>
            <span style={s.brandText}>Interview System</span>
          </div>
          <h2 style={s.leftTitle}>Welcome back.</h2>
          <p style={s.leftSub}>Continue your interview prep and track your progress.</p>
          <div style={s.featureList}>
            {['AI-scored answers', 'Voice input support', '4 tech domains', 'Private dashboard'].map(f => (
              <div key={f} style={s.featureItem}><span style={s.featureCheck}>✦</span> {f}</div>
            ))}
          </div>
        </div>
      </div>
      <div style={s.right}>
        <div style={s.card}>
          <h1 style={s.title}>Sign in</h1>
          <p style={s.subtitle}>Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign up free</Link></p>
          {error && <div style={s.error}>{error}</div>}
          <div style={s.field}>
            <label style={s.label}>Email address</label>
            <input style={s.input} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} className="btn-glow" onClick={handleLogin} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { display: 'flex', minHeight: '100vh' },
  left: { flex: 1, background: 'linear-gradient(135deg, #eeeaf5 0%, #e8e2f5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', position: 'relative', overflow: 'hidden', borderRight: '1px solid var(--border)' },
  leftGlow: { position: 'absolute', top: '20%', left: '30%', width: '400px', height: '400px', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(91,106,191,0.12) 0%, transparent 65%)' },
  leftContent: { maxWidth: '380px', position: 'relative', zIndex: 1 },
  brand: { display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2.5rem' },
  brandIcon: { width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' },
  brandText: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' },
  leftTitle: { fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.15, marginBottom: '1rem' },
  leftSub: { fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '2rem' },
  featureList: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  featureItem: { fontSize: '0.875rem', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  featureCheck: { color: 'var(--accent)', fontSize: '0.7rem' },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', background: 'var(--bg)' },
  card: { width: '100%', maxWidth: '400px' },
  title: { fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' },
  subtitle: { color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '2rem' },
  error: { background: 'rgba(196,90,106,0.08)', border: '1px solid rgba(196,90,106,0.25)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '1.5rem' },
  field: { marginBottom: '1.25rem' },
  label: { display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' },
  input: { width: '100%', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem', fontSize: '0.95rem', color: 'var(--text)', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  btn: { width: '100%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff', border: 'none', padding: '0.9rem', fontWeight: 700, fontSize: '1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', marginTop: '0.5rem' },
}
