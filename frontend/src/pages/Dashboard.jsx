import { useEffect, useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Link } from 'react-router-dom'
import axios from 'axios'
import BASE_URL from '../api'
import { useAuth } from '../AuthContext'

export default function Dashboard() {
  useScrollAnimation()
  const { token, user } = useAuth()
  const [aptitude, setAptitude] = useState([])
  const [interview, setInterview] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get(`${BASE_URL}/api/results/aptitude`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${BASE_URL}/api/results/interview`, { headers: { Authorization: `Bearer ${token}` } }),
    ]).then(([a, b]) => {
      setAptitude(a.data.results || [])
      setInterview(b.data.results || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '32px', height: '32px', border: '3px solid var(--border2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>Loading your results...</div>
    </div>
  )

  const bestApt = aptitude.length ? Math.max(...aptitude.map(r => Math.round((r.score / r.total) * 100))) : null
  const bestInt = interview.length ? Math.max(...interview.map(r => r.overall_score)) : null
  const totalTests = aptitude.length + interview.length

  return (
    <main style={s.main} className="page-enter">
      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={s.tag}>Dashboard</div>
          <h1 style={s.title}>
            {user?.full_name ? `Welcome back, ${user.full_name.split(' ')[0]}!` : 'Your Results'}
          </h1>
        </div>
        <div style={s.btnGroup}>
          <Link to="/aptitude" style={s.btnSecondary}>Take Aptitude Test</Link>
          <Link to="/interview" style={s.btnPrimary} className="btn-glow">Start Interview →</Link>
        </div>
      </div>

      {/* Stats row */}
      <div style={s.statsRow} className="scroll-animate scroll-animate-scale scroll-delay-1">
        {[
          { label: 'Total Tests', val: totalTests, color: 'var(--accent)', bg: 'rgba(91,106,191,0.08)', border: 'rgba(91,106,191,0.2)' },
          { label: 'Aptitude Tests', val: aptitude.length, color: 'var(--accent3)', bg: 'rgba(167,212,245,0.08)', border: 'rgba(167,212,245,0.2)' },
          { label: 'Best Aptitude', val: bestApt !== null ? `${bestApt}%` : '—', color: 'var(--success)', bg: 'rgba(123,229,192,0.08)', border: 'rgba(123,229,192,0.2)' },
          { label: 'Best Interview', val: bestInt !== null ? `${bestInt}/10` : '—', color: 'var(--accent2)', bg: 'rgba(124,106,191,0.08)', border: 'rgba(124,106,191,0.2)' },
        ].map((st, i) => (
          <div key={i} style={{ ...s.statCard, background: st.bg, border: `1px solid ${st.border}` }}>
            <div style={{ ...s.statVal, color: st.color }}>{st.val}</div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Aptitude Results */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <div style={s.sectionTitle}>Aptitude Tests</div>
          <span style={s.count}>{aptitude.length} attempt{aptitude.length !== 1 ? 's' : ''}</span>
        </div>
        {aptitude.length === 0 ? (
          <EmptyState text="No aptitude tests taken yet." link="/aptitude" linkText="Take your first test →" />
        ) : (
          aptitude.slice().reverse().map((r, i) => {
            const pct = Math.round((r.score / r.total) * 100)
            const passed = pct >= 60
            const c = passed ? 'var(--success)' : 'var(--danger)'
            return (
              <div key={i} style={s.resultRow} className="card-hover">
                <div style={s.rowLeft}>
                  <div style={{ ...s.rowBadge, background: passed ? 'rgba(123,229,192,0.1)' : 'rgba(245,122,139,0.1)', color: c, border: `1px solid ${c}44` }}>
                    {passed ? '✓ Pass' : '✗ Fail'}
                  </div>
                  <div>
                    <div style={s.rowTitle}>Aptitude Test</div>
                    <div style={s.rowDate}>{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                </div>
                <div style={s.rowRight}>
                  <div style={s.scoreBar}>
                    <div style={{ ...s.scoreFill, width: `${pct}%`, background: `linear-gradient(90deg, ${c}, var(--accent))` }} />
                  </div>
                  <div style={{ ...s.scoreText, color: c }}>{r.score}/{r.total} · {pct}%</div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Interview Results */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <div style={s.sectionTitle}>Interview Results</div>
          <span style={s.count}>{interview.length} attempt{interview.length !== 1 ? 's' : ''}</span>
        </div>
        {interview.length === 0 ? (
          <EmptyState text="No interviews taken yet." link="/interview" linkText="Start your first interview →" />
        ) : (
          interview.slice().reverse().map((r, i) => {
            const sc = r.overall_score
            const c = sc >= 7 ? 'var(--success)' : sc >= 5 ? 'var(--warning)' : 'var(--danger)'
            const verdict = sc >= 7 ? 'Excellent' : sc >= 5 ? 'Good' : 'Needs Practice'
            const field = (r.field || 'Unknown').replace(/([A-Z])/g, ' $1').trim()
            return (
              <div key={i} style={s.resultRow} className="card-hover">
                <div style={s.rowLeft}>
                  <div style={{ ...s.rowBadge, background: `${c}18`, color: c, border: `1px solid ${c}44` }}>
                    {verdict}
                  </div>
                  <div>
                    <div style={s.rowTitle}>{field}</div>
                    <div style={s.rowDate}>{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                </div>
                <div style={s.rowRight}>
                  <div style={s.scoreBar}>
                    <div style={{ ...s.scoreFill, width: `${(sc / 10) * 100}%`, background: `linear-gradient(90deg, ${c}, var(--accent))` }} />
                  </div>
                  <div style={{ ...s.scoreText, color: c }}>{sc}/10</div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </main>
  )
}

function EmptyState({ text, link, linkText }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px dashed var(--border2)', borderRadius: 'var(--radius)', padding: '2.5rem', textAlign: 'center' }}>
      <div style={{ color: 'var(--text3)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{text}</div>
      <Link to={link} style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600 }}>{linkText}</Link>
    </div>
  )
}

const s = {
  main: { maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' },
  tag: { fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: '0.3rem' },
  title: { fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--text)' },
  btnGroup: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' },
  btnPrimary: { background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff', padding: '0.65rem 1.25rem', fontWeight: 700, fontSize: '0.875rem', borderRadius: 'var(--radius-sm)' },
  btnSecondary: { background: 'var(--surface)', border: '1px solid var(--border2)', color: 'var(--text)', padding: '0.65rem 1.25rem', fontSize: '0.875rem', fontWeight: 500, borderRadius: 'var(--radius-sm)' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '3rem' },
  statCard: { borderRadius: 'var(--radius)', padding: '1.25rem 1.5rem' },
  statVal: { fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, lineHeight: 1, marginBottom: '0.3rem' },
  statLabel: { fontSize: '0.75rem', color: 'var(--text2)', fontWeight: 500 },
  section: { marginBottom: '3rem' },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' },
  sectionTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' },
  count: { fontSize: '0.78rem', color: 'var(--text3)', background: 'var(--surface2)', border: '1px solid var(--border)', padding: '0.2rem 0.6rem', borderRadius: '100px' },
  resultRow: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem 1.25rem', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' },
  rowLeft: { display: 'flex', alignItems: 'center', gap: '0.875rem' },
  rowBadge: { padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' },
  rowTitle: { fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.15rem' },
  rowDate: { fontSize: '0.75rem', color: 'var(--text3)' },
  rowRight: { display: 'flex', alignItems: 'center', gap: '0.875rem', minWidth: '200px' },
  scoreBar: { flex: 1, height: '5px', background: 'var(--surface2)', borderRadius: '3px', overflow: 'hidden' },
  scoreFill: { height: '100%', borderRadius: '3px', transition: 'width 0.8s ease' },
  scoreText: { fontSize: '0.875rem', fontWeight: 700, minWidth: '60px', textAlign: 'right' },
}
