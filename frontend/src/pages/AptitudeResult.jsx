import { useLocation, Link } from 'react-router-dom'

export default function AptitudeResult() {
  const { state } = useLocation()

  if (!state) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text2)' }}>
      No result data found. <Link to="/aptitude" style={{ color: 'var(--accent)' }}>Take the test</Link>
    </div>
  )

  const { score, total, results } = state
  const pct = Math.round((score / total) * 100)
  const passed = pct >= 60

  return (
    <main style={styles.main}>
      <div style={styles.header}>
        <div style={styles.label}>Aptitude Test — Results</div>
        <div style={{
          ...styles.verdict,
          color: passed ? 'var(--accent)' : 'var(--accent3)',
          borderColor: passed ? 'var(--accent)' : 'var(--accent3)',
        }}>
          {passed ? 'PASSED' : 'FAILED'}
        </div>
      </div>

      <div style={styles.scoreCard}>
        <div style={styles.bigScore}>{score}<span style={{ color: 'var(--text3)', fontSize: '2rem' }}>/{total}</span></div>
        <div style={styles.pct}>{pct}% correct</div>
        <div style={styles.bar}>
          <div style={{ ...styles.barFill, width: `${pct}%`, background: passed ? 'var(--accent)' : 'var(--accent3)' }} />
        </div>
      </div>

      <div style={styles.breakdown}>
        {results.map((r, i) => (
          <div key={i} style={{
            ...styles.row,
            borderLeftColor: r.correct ? 'var(--accent)' : 'var(--accent3)'
          }}>
            <div style={styles.rowQ}>{r.question}</div>
            <div style={styles.rowAnswers}>
              <span style={{ color: 'var(--text2)', fontSize: '0.75rem' }}>
                Your answer: <strong style={{ color: r.correct ? 'var(--accent)' : 'var(--accent3)' }}>{r.your_answer}</strong>
              </span>
              {!r.correct && (
                <span style={{ color: 'var(--text2)', fontSize: '0.75rem' }}>
                  &nbsp;·&nbsp; Correct: <strong style={{ color: 'var(--accent)' }}>{r.correct_answer}</strong>
                </span>
              )}
              <span style={{ marginLeft: '0.5rem' }}>{r.correct ? '✔' : '✘'}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.actions}>
        <Link to="/interview" style={styles.btnPrimary}>Proceed to Interview →</Link>
        <Link to="/aptitude" style={styles.btnSecondary}>Retake Test</Link>
      </div>
    </main>
  )
}

const styles = {
  main: { maxWidth: '720px', margin: '0 auto', padding: '3rem 2rem' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' },
  label: { fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text3)' },
  verdict: {
    fontSize: '0.75rem', letterSpacing: '0.18em', fontWeight: 700,
    border: '1px solid', padding: '0.25rem 0.75rem', borderRadius: '2px',
  },
  scoreCard: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: '4px', padding: '2.5rem', marginBottom: '2rem', textAlign: 'center',
  },
  bigScore: {
    fontFamily: 'var(--font-display)', fontSize: '5rem',
    fontWeight: 800, lineHeight: 1, marginBottom: '0.5rem',
  },
  pct: { color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '1.5rem' },
  bar: { height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '3px', transition: 'width 0.8s ease' },
  breakdown: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' },
  row: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderLeft: '3px solid', padding: '1rem 1.25rem', borderRadius: '3px',
  },
  rowQ: { fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text)' },
  rowAnswers: { display: 'flex', alignItems: 'center' },
  actions: { display: 'flex', gap: '1rem' },
  btnPrimary: {
    background: 'var(--accent)', color: '#000',
    padding: '0.85rem 2rem', fontWeight: 700,
    fontSize: '0.85rem', letterSpacing: '0.08em', borderRadius: '2px',
  },
  btnSecondary: {
    border: '1px solid var(--border)', color: 'var(--text2)',
    padding: '0.85rem 2rem', fontSize: '0.85rem',
    letterSpacing: '0.08em', borderRadius: '2px',
  }
}
