import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

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
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2.5rem',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(6,6,8,0.85)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '1.3rem',
    letterSpacing: '0.05em',
    color: 'var(--text)',
  },
  links: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  link: {
    fontSize: '0.8rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--text2)',
    transition: 'color 0.2s',
    padding: '0.25rem 0',
    borderBottom: '1px solid transparent',
  },
  active: {
    color: 'var(--accent)',
    borderBottomColor: 'var(--accent)',
  }
}
