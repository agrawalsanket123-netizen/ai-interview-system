import { useEffect, useState } from 'react'
import axios from 'axios'
import BASE_URL from '../api'
import { useAuth } from '../AuthContext'

export default function Dashboard() {
  const { token } = useAuth()
  const [aptitude, setAptitude] = useState([])
  const [interview, setInterview] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('interview')

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
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: 'var(--text2)' }}>
      Loading results...
    </div>
  )

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleString()
  }

  const avgAptitude = aptitude.length > 0
    ? Math.round((aptitude.reduce((s, a) => s + (a.score / a.total) * 100, 0) / aptitude.length))
    : null

  const avgInterview = interview.length > 0
    ? (interview.reduce((s, r) => s + (r.overall_score || 0), 0) / interview.length).toFixed(1)
    : null

  return (
    <main style={styles.main}>
      <div style={styles.pageHeader}>
        <div style={styles.label}>Results Dashboard</div>
        <h2 style={styles.h2}>Your History</h2>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statNum}>{aptitude.length}</div>
          <div style={styles.statLabel}>Aptitude Tests</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNum}>{interview.length}</div>
          <div style={styles.statLabel}>Interviews Done</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNum}>{avgAptitude !== null ? avgAptitude + '%' : '—'}</div>
          <div style={styles.statLabel}>Avg Aptitude Score</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNum}>{avgInterview !== null ? avgInterview + '/10' : '—'}</div>
          <div style={styles.statLabel}>Avg Interview Score</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {['interview', 'aptitude'].map(t => (
          <button
            key={t}
            style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)} Results
          </button>
        ))}
      </div>

      {/* Interview Tab */}
      {tab === 'interview' && (
        <div>
          {interview.length === 0 ? (
            <Empty label="No interview results yet." />
          ) : interview.map((r, i) => {
            const score = r.overall_score || 0
            const color = score >= 7 ? 'var(--accent)' : score >= 5 ? '#ffd166' : 'var(--accent3)'
            const responses = Array.isArray(r.responses) ? r.responses : []
            return (
              <div key={i} style={styles.sessionCard}>
                <div style={styles.sessionHeader}>
                  <div>
                    <div style={{ ...styles.fieldTag, color }}>
                      {r.field?.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div style={styles.ts}>{formatDate(r.created_at)}</div>
                  </div>
                  <div style={{ ...styles.sessionScore, color }}>{score}/10</div>
                </div>
                {responses.map((item, j) => {
                  const itemScore = item.score || 0
                  const itemColor = itemScore >= 7 ? 'var(--accent)' : itemScore >= 5 ? '#ffd166' : 'var(--accent3)'
                  return (
                    <div key={j} style={styles.itemRow}>
                      <div style={styles.itemQ}>{item.question}</div>
                      <div style={styles.itemMeta}>
                        <span style={{ color: 'var(--text2)', fontSize: '0.75rem' }}>Score: </span>
                        <strong style={{ color: itemColor, fontSize: '0.8rem' }}>{itemScore}/10</strong>
                        <span style={{ color: 'var(--text2)', fontSize: '0.75rem', marginLeft: '0.75rem' }}>
                          {item.feedback}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}

      {/* Aptitude Tab */}
      {tab === 'aptitude' && (
        <div>
          {aptitude.length === 0 ? (
            <Empty label="No aptitude test results yet." />
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Date', 'Score', 'Out of', 'Percentage'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {aptitude.map((r, i) => {
                  const pct = Math.round((r.score / r.total) * 100)
                  return (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.td}>{formatDate(r.created_at)}</td>
                      <td style={styles.td}>{r.score}</td>
                      <td style={styles.td}>{r.total}</td>
                      <td style={styles.td}>
                        <span style={{ color: pct >= 60 ? 'var(--accent)' : 'var(--accent3)', fontWeight: 700 }}>
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  )
}

function Empty({ label }) {
  return (
    <div style={{
      textAlign: 'center', padding: '4rem',
      color: 'var(--text3)', fontSize: '0.85rem',
      border: '1px dashed var(--border)', borderRadius: '4px',
    }}>
      {label}
    </div>
  )
}

const styles = {
  main: { maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' },
  pageHeader: { marginBottom: '2.5rem' },
  label: { fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.5rem' },
  h2: { fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' },
  statCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1.5rem', textAlign: 'center' },
  statNum: { fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.25rem' },
  statLabel: { fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text3)' },
  tabs: { display: 'flex', gap: '0', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' },
  tab: { background: 'transparent', border: 'none', borderBottom: '2px solid transparent', color: 'var(--text3)', padding: '0.75rem 1.5rem', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '-1px', transition: 'all 0.2s', cursor: 'pointer' },
  tabActive: { color: 'var(--accent)', borderBottomColor: 'var(--accent)' },
  sessionCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', marginBottom: '1.25rem', overflow: 'hidden' },
  sessionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' },
  fieldTag: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' },
  ts: { fontSize: '0.7rem', color: 'var(--text3)' },
  sessionScore: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem' },
  itemRow: { padding: '0.9rem 1.5rem', borderBottom: '1px solid var(--border)' },
  itemQ: { fontSize: '0.85rem', color: 'var(--text)', marginBottom: '0.35rem' },
  itemMeta: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text3)', textAlign: 'left', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' },
  tr: { borderBottom: '1px solid var(--border)' },
  td: { fontSize: '0.85rem', color: 'var(--text2)', padding: '0.9rem 1rem' },
}
