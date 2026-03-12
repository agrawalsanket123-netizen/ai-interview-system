import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const location = useLocation()
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  const links = [
    { to: '/', label: 'Home' },
    { to: '/aptitude', label: 'Aptitude' },
    { to: '/interview', label: 'Interview' },
    { to: '/dashboard', label: 'Results' },
  ]

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.logo}>
        <div style={s.logoIcon}>AI</div>
        <span style={s.logoText}>Interview</span>
      </Link>

      <div style={s.links}>
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{
            ...s.link,
            ...(location.pathname === l.to ? s.active : {})
          }}>
            {l.label}
            {location.pathname === l.to && <div style={s.activeDot} />}
          </Link>
        ))}
      </div>

      <div style={s.auth}>
        {isLoggedIn ? (
          <>
            <div style={s.userChip}>
              <div style={s.userAvatar}>{(user?.full_name || user?.email || 'U')[0].toUpperCase()}</div>
              <span style={s.userName}>{user?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}</span>
            </div>
            <button style={s.logoutBtn} onClick={handleLogout}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login" style={s.loginBtn}>Log in</Link>
            <Link to="/register" style={s.registerBtn} className="btn-glow">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const s = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0.875rem 2.5rem',
    background: 'rgba(7,7,26,0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky', top: 0, zIndex: 100,
    flexWrap: 'wrap', gap: '0.5rem',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  logoIcon: {
    width: '32px', height: '32px', borderRadius: '8px',
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.7rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)',
    letterSpacing: '0.05em',
  },
  logoText: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' },
  links: { display: 'flex', gap: '0.25rem' },
  link: {
    fontSize: '0.875rem', color: 'var(--text2)', padding: '0.45rem 0.9rem',
    borderRadius: 'var(--radius-sm)', transition: 'all 0.2s', fontWeight: 500,
    position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
  },
  active: { color: 'var(--accent)', background: 'rgba(139,167,245,0.08)' },
  activeDot: { width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' },
  auth: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  userChip: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: '100px', padding: '0.3rem 0.75rem 0.3rem 0.3rem',
  },
  userAvatar: {
    width: '24px', height: '24px', borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.7rem', fontWeight: 700, color: '#fff',
  },
  userName: { fontSize: '0.82rem', color: 'var(--text)', fontWeight: 500 },
  logoutBtn: {
    background: 'transparent', border: '1px solid var(--border)',
    color: 'var(--text2)', padding: '0.4rem 1rem',
    fontSize: '0.82rem', borderRadius: 'var(--radius-sm)', fontWeight: 500,
    transition: 'all 0.2s',
  },
  loginBtn: { fontSize: '0.875rem', color: 'var(--text2)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: 500 },
  registerBtn: {
    fontSize: '0.875rem', color: '#07071a',
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    padding: '0.4rem 1.1rem', borderRadius: 'var(--radius-sm)', fontWeight: 700,
  },
}
