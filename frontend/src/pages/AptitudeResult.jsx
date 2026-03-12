import { useLocation, Link } from 'react-router-dom'

export default function AptitudeResult() {
  const { state } = useLocation()
  if (!state) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text2)' }}>No data. <Link to="/aptitude" style={{ color: 'var(--accent)' }}>Take the test</Link></div>

  const { score, total, results } = state
  const pct = Math.round((score / total) * 100)
  const passed = pct >= 60
  const scoreColor = passed ? 'var(--success)' : 'var(--danger)'

  return (
    <main style={s.main} className="page-enter">
      <div style={s.header}>
        <div style={s.tag}>Aptitude Test · Results</div>
        <div style={{ ...s.verdict, background: passed ? 'rgba(123,229,192,0.1)' : 'rgba(245,122,139,0.1)', color: scoreColor, border: `1px solid ${passed ? 'rgba(123,229,192,0.3)' : 'rgba(245,122,139,0.3)'}` }}>
          {passed ? '✓ Passed' : '✗ Try Again'}
        </div>
      </div>

      <div style={s.scoreCard} className="stagger-1">
        <div style={s.scoreLeft}>
          <div style={{ ...s.bigScore, color: scoreColor }}>{score}</div>
          <div style={s.scoreOut}>/ {total}</div>
        </div>
        <div style={s.scoreRight}>
          <div style={s.pctLabel}>{pct}% correct</div>
          <div style={s.bar}><div style={{ ...s.barFill, width: `${pct}%`, background: `linear-gradient(90deg, ${passed ? 'var(--success)' : 'var(--danger)'}, ${passed ? 'var(--accent3)' : 'var(--accent4)'})` }} /></div>
          <div style={s.hint}>{passed ? '🎉 Great! You qualify for the interview round.' : '📚 You need 60% to qualify. Keep practicing!'}</div>
        </div>
      </div>

      <div style={s.sectionLabel}>Question Breakdown</div>
      {results.map((r, i) => (
        <div key={i} style={{ ...s.row, borderLeftColor: r.correct ? 'var(--success)' : 'var(--danger)' }} className="stagger-1">
          <div style={s.rowTop}>
            <div style={s.rowQ}>{r.question}</div>
            <span style={{ ...s.badge, background: r.correct ? 'rgba(123,229,192,0.1)' : 'rgba(245,122,139,0.1)', color: r.correct ? 'var(--success)' : 'var(--danger)' }}>
              {r.correct ? '✓' : '✗'}
            </span>
          </div>
          <div style={s.rowMeta}>
            <span style={s.metaTag}>Your answer: <strong style={{ color: r.correct ? 'var(--success)' : 'var(--danger)' }}>{r.your_answer}</strong></span>
            {!r.correct && <span style={s.metaTag}>· Correct: <strong style={{ color: 'var(--success)' }}>{r.correct_answer}</strong></span>}
          </div>
        </div>
      ))}

      <div style={s.actions}>
        <Link to="/interview" style={s.btnPrimary} className="btn-glow">Proceed to Interview →</Link>
        <Link to="/aptitude" style={s.btnSecondary}>Retake Test</Link>
      </div>
    </main>
  )
}

const s = {
  main: { maxWidth: '720px', margin: '0 auto', padding: '3rem 2rem' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  tag: { fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)' },
  verdict: { padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 600 },
  scoreCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' },
  scoreLeft: { textAlign: 'center', minWidth: '100px' },
  bigScore: { fontFamily: 'var(--font-display)', fontSize: '5rem', fontWeight: 800, lineHeight: 1 },
  scoreOut: { color: 'var(--text3)', fontSize: '1rem' },
  scoreRight: { flex: 1 },
  pctLabel: { fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.75rem' },
  bar: { height: '8px', background: 'var(--surface2)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' },
  barFill: { height: '100%', borderRadius: '4px', transition: 'width 1s ease' },
  hint: { fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.5 },
  sectionLabel: { fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: '1rem' },
  row: { background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid', borderRadius: 'var(--radius-sm)', padding: '1rem 1.25rem', marginBottom: '0.75rem' },
  rowTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' },
  rowQ: { fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.5, flex: 1 },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 },
  rowMeta: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  metaTag: { fontSize: '0.8rem', color: 'var(--text2)' },
  actions: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' },
  btnPrimary: { background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff', padding: '0.875rem 1.75rem', fontWeight: 700, fontSize: '0.9rem', borderRadius: 'var(--radius-sm)' },
  btnSecondary: { background: 'var(--surface)', border: '1px solid var(--border2)', color: 'var(--text)', padding: '0.875rem 1.5rem', fontSize: '0.9rem', fontWeight: 500, borderRadius: 'var(--radius-sm)' },
}
