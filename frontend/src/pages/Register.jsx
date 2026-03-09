import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import BASE_URL from '../api'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!fullName || !email || !password) { setError('Please fill in all fields'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setError('')
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, { email, password, full_name: fullName })
      setSuccess('Registration successful! Please check your email to verify your account, then login.')
    } catch (e) {
      setError(e.response?.data?.detail || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.label}>Create Account</div>
        <h2 style={styles.h2}>Register</h2>

        {error && <div style={styles.error}>{error}</div>}
        {success && (
          <div style={styles.success}>
            {success}
            <br /><br />
            <Link to="/login" style={{ color: 'var(--accent)' }}>Go to Login →</Link>
          </div>
        )}

        {!success && (
          <>
            <div style={styles.field}>
              <label style={styles.fieldLabel}>Full Name</label>
              <input style={styles.input} type="text" placeholder="Your Name" value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.fieldLabel}>Email</label>
              <input style={styles.input} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.fieldLabel}>Password</label>
              <input style={styles.input} type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRegister()} />
            </div>
            <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} onClick={handleRegister} disabled={loading}>
              {loading ? 'Registering...' : 'Create Account →'}
            </button>
            <div style={styles.footer}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--accent)' }}>Login here</Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

const styles = {
  main: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '3rem', width: '100%', maxWidth: '440px' },
  label: { fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' },
  h2: { fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' },
  error: { background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '3px', padding: '0.75rem 1rem', color: 'var(--accent3)', fontSize: '0.85rem', marginBottom: '1.5rem' },
  success: { background: 'rgba(0,255,135,0.05)', border: '1px solid rgba(0,255,135,0.2)', borderRadius: '3px', padding: '1rem', color: 'var(--accent)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.5rem' },
  field: { marginBottom: '1.25rem' },
  fieldLabel: { display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.5rem' },
  input: { width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '3px', padding: '0.85rem 1rem', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', background: 'var(--accent)', color: '#000', border: 'none', padding: '0.9rem', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.08em', borderRadius: '3px', cursor: 'pointer', marginTop: '0.5rem', marginBottom: '1.5rem' },
  footer: { fontSize: '0.85rem', color: 'var(--text2)', textAlign: 'center' }
}
