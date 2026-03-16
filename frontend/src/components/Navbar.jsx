import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import logo from '../assets/logo.png'

export default function Navbar() {
  const location = useLocation()
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login'); setMenuOpen(false) }

  const links = [
    { to: '/', label: 'Home' },
    { to: '/aptitude', label: 'Aptitude' },
    { to: '/interview', label: 'Interview' },
    { to: '/dashboard', label: 'Results' },
  ]

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.logo} onClick={() => setMenuOpen(false)}>
        <img src={logo} alt="Skillscope AI" style={s.logoImg} />
      </Link>

      {/* Desktop links */}
      <div style={s.links} className="hide-mobile">
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{
            ...s.link, ...(location.pathname === l.to ? s.active : {})
          }}>
            {l.label}
            {location.pathname === l.to && <div style={s.activeDot} />}
          </Link>
        ))}
      </div>

      {/* Desktop auth */}
      <div style={s.auth} className="hide-mobile">
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

      {/* Hamburger */}
      <button style={s.hamburger} className="show-mobile" onClick={() => setMenuOpen(o => !o)}>
        <div style={{ ...s.bar, transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
        <div style={{ ...s.bar, opacity: menuOpen ? 0 : 1 }} />
        <div style={{ ...s.bar, transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={s.mobileMenu}>
          {links.map(l => (
            <Link key={l.to} to={l.to}
              style={{ ...s.mobileLink, color: location.pathname === l.to ? 'var(--accent)' : 'var(--text)' }}
              onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div style={s.mobileDivider} />
          {isLoggedIn ? (
            <button style={s.mobileLogout} onClick={handleLogout}>Sign out</button>
          ) : (
            <>
              <Link to="/login" style={s.mobileLink} onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link to="/register" style={s.mobileRegister} onClick={() => setMenuOpen(false)}>Get Started →</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

const s = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0.75rem 2.5rem',
    background: 'rgba(250,247,242,0.9)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky', top: 0, zIndex: 100,
    flexWrap: 'wrap', gap: '0.5rem',
  },
  logo: { display: 'flex', alignItems: 'center', zIndex: 1 },
  logoImg: { height: '42px', width: 'auto', objectFit: 'contain' },
  links: { display: 'flex', gap: '0.25rem' },
  link: { fontSize: '0.875rem', color: 'var(--text2)', padding: '0.45rem 0.9rem', borderRadius: 'var(--radius-sm)', transition: 'all 0.2s', fontWeight: 500, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' },
  active: { color: 'var(--accent)', background: 'rgba(91,106,191,0.08)' },
  activeDot: { width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' },
  auth: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  userChip: { display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '100px', padding: '0.3rem 0.75rem 0.3rem 0.3rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  userAvatar: { width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#fff' },
  userName: { fontSize: '0.82rem', color: 'var(--text)', fontWeight: 500 },
  logoutBtn: { background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', padding: '0.4rem 1rem', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)', fontWeight: 500, transition: 'all 0.2s', cursor: 'pointer' },
  loginBtn: { fontSize: '0.875rem', color: 'var(--text2)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: 500 },
  registerBtn: { fontSize: '0.875rem', color: '#fff', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', padding: '0.4rem 1.1rem', borderRadius: 'var(--radius-sm)', fontWeight: 700 },
  hamburger: { display: 'none', flexDirection: 'column', gap: '5px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', zIndex: 1 },
  bar: { width: '22px', height: '2px', background: 'var(--text)', borderRadius: '2px', transition: 'all 0.25s ease' },
  mobileMenu: { position: 'absolute', top: '100%', left: 0, right: 0, background: 'rgba(250,247,242,0.98)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '1rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', zIndex: 99 },
  mobileLink: { fontSize: '1rem', color: 'var(--text)', padding: '0.65rem 0', fontWeight: 500, borderBottom: '1px solid var(--border)', display: 'block' },
  mobileDivider: { height: '1px', background: 'var(--border)', margin: '0.5rem 0' },
  mobileLogout: { background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', padding: '0.6rem 1rem', fontSize: '0.9rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', textAlign: 'left' },
  mobileRegister: { background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.95rem', textAlign: 'center', marginTop: '0.25rem' },
}