import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import BASE_URL from '../api'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!fullName || !email || !password) { setError('Please fill in all fields'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, { email, password, full_name: fullName })
      setSuccess(true)
    } catch (e) { setError(e.response?.data?.detail || 'Registration failed') }
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
          <h2 style={s.leftTitle}>Start your prep<br />journey today.</h2>
          <p style={s.leftSub}>AI-powered interviews across 4 technical domains. Free forever.</p>
          <div style={s.statsRow}>
            {[['40+', 'Questions'], ['4', 'Domains'], ['AI', 'Scoring']].map(([v, l]) => (
              <div key={l} style={s.statItem}>
                <div style={s.statVal}>{v}</div>
                <div style={s.statLabel}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.right}>
        <div style={s.card}>
          {success ? (
            <div style={s.successBox}>
              <div style={s.successIcon}>✓</div>
              <h2 style={s.title}>Account created!</h2>
              <p style={s.subtitle}>You can now sign in and start practicing.</p>
              <Link to="/login" style={s.btn} className="btn-glow">Go to Sign In →</Link>
            </div>
          ) : (
            <>
              <h1 style={s.title}>Create account</h1>
              <p style={s.subtitle}>Already have one? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link></p>

              {error && <div style={s.error}>{error}</div>}

              {[
                { label: 'Full Name', val: fullName, set: setFullName, type: 'text', ph: 'Your Name' },
                { label: 'Email address', val: email, set: setEmail, type: 'email', ph: 'you@example.com' },
                { label: 'Password', val: password, set: setPassword, type: 'password', ph: 'Min 6 characters' },
              ].map(f => (
                <div key={f.label} style={s.field}>
                  <label style={s.label}>{f.label}</label>
                  <input style={s.input} type={f.type} placeholder={f.ph}
                    value={f.val} onChange={e => f.set(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRegister()} />
                </div>
              ))}

              <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} className="btn-glow" onClick={handleRegister} disabled={loading}>
                {loading ? 'Creating...' : 'Create Account →'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { display: 'flex', minHeight: '100vh' },
  left: { flex: 1, background: 'linear-gradient(135deg, #0d0d28 0%, #10102e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', position: 'relative', overflow: 'hidden', borderRight: '1px solid var(--border)' },
  leftGlow: { position: 'absolute', top: '30%', right: '20%', width: '400px', height: '400px', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(184,167,245,0.1) 0%, transparent 65%)' },
  leftContent: { maxWidth: '380px', position: 'relative', zIndex: 1 },
  brand: { display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2.5rem' },
  brandIcon: { width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#07071a', fontFamily: 'var(--font-display)' },
  brandText: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' },
  leftTitle: { fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.15, marginBottom: '1rem' },
  leftSub: { fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '2rem' },
  statsRow: { display: 'flex', gap: '2rem' },
  statItem: { textAlign: 'center' },
  statVal: { fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  statLabel: { fontSize: '0.75rem', color: 'var(--text2)', marginTop: '0.2rem' },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', background: 'var(--bg)' },
  card: { width: '100%', maxWidth: '400px' },
  successBox: { textAlign: 'center', padding: '1rem 0' },
  successIcon: { width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(123,229,192,0.1)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem', color: 'var(--success)' },
  title: { fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' },
  subtitle: { color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '2rem' },
  error: { background: 'rgba(245,122,139,0.1)', border: '1px solid rgba(245,122,139,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '1.5rem' },
  field: { marginBottom: '1.25rem' },
  label: { display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' },
  input: { width: '100%', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem', fontSize: '0.95rem', color: 'var(--text)', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' },
  btn: { display: 'block', width: '100%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#07071a', border: 'none', padding: '0.9rem', fontWeight: 700, fontSize: '1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', marginTop: '0.5rem', textAlign: 'center', boxSizing: 'border-box' },
}
