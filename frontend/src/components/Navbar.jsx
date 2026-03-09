import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const location = useLocation()
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const links = [
    { to: '/', label: 'Home' },
    { to: '/aptitude', label: 'Aptitude' },
    { to: '/interview', label: 'Interview' },
    { to: '/dashboard', label: 'Results' },
  ]

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        AI<span style={{ color: 'var(--accent)' }}>NTERVIEW</span>
      </Link>

      <div style={styles.links}>
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            style={{
              ...styles.link,
              ...(location.pathname === l.to ? styles.active : {})
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div style={styles.authSection}>
        {isLoggedIn ? (
          <>
            <span style={styles.userName}>👤 {user?.full_name || user?.email}</span>
            <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.loginBtn}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1rem 2.5rem', borderBottom: '1px solid var(--border)',
    background: 'rgba(6,6,8,0.85)', backdropFilter: 'blur(12px)',
    position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap', gap: '0.5rem',
  },
  logo: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.05em', color: 'var(--text)' },
  links: { display: 'flex', gap: '2rem', alignItems: 'center' },
  link: { fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text2)', transition: 'color 0.2s', padding: '0.25rem 0', borderBottom: '1px solid transparent' },
  active: { color: 'var(--accent)', borderBottomColor: 'var(--accent)' },
  authSection: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  userName: { fontSize: '0.8rem', color: 'var(--text2)' },
  logoutBtn: { background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', padding: '0.3rem 0.85rem', fontSize: '0.75rem', borderRadius: '2px', cursor: 'pointer', letterSpacing: '0.08em' },
  loginBtn: { fontSize: '0.8rem', color: 'var(--text2)', letterSpacing: '0.08em', border: '1px solid var(--border)', padding: '0.3rem 0.85rem', borderRadius: '2px' },
  registerBtn: { fontSize: '0.8rem', color: '#000', background: 'var(--accent)', padding: '0.3rem 0.85rem', borderRadius: '2px', fontWeight: 700, letterSpacing: '0.08em' },
}
