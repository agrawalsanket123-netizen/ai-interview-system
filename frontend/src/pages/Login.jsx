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
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password })
      login(res.data.user, res.data.access_token)
      navigate('/')
    } catch (e) {
      setError('Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.label}>Welcome Back</div>
        <h2 style={styles.h2}>Login</h2>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.fieldLabel}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.fieldLabel}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <button
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login →'}
        </button>

        <div style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)' }}>Register here</Link>
        </div>
      </div>
    </main>
  )
}

const styles = {
  main: {
    minHeight: '80vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: '2rem'
  },
  card: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: '4px', padding: '3rem', width: '100%', maxWidth: '440px',
  },
  label: { fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' },
  h2: { fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' },
  error: {
    background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
    borderRadius: '3px', padding: '0.75rem 1rem',
    color: 'var(--accent3)', fontSize: '0.85rem', marginBottom: '1.5rem',
  },
  field: { marginBottom: '1.25rem' },
  fieldLabel: { display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.5rem' },
  input: {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: '3px', padding: '0.85rem 1rem', color: 'var(--text)',
    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
  },
  btn: {
    width: '100%', background: 'var(--accent)', color: '#000',
    border: 'none', padding: '0.9rem', fontWeight: 700,
    fontSize: '0.9rem', letterSpacing: '0.08em', borderRadius: '3px',
    cursor: 'pointer', marginTop: '0.5rem', marginBottom: '1.5rem',
  },
  footer: { fontSize: '0.85rem', color: 'var(--text2)', textAlign: 'center' }
}
