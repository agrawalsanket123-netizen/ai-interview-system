import { useLocation, Link } from 'react-router-dom'

const ScoreBar = ({ score }) => {
  const pct = (score / 10) * 100
  const color = score >= 7 ? 'var(--accent)' : score >= 5 ? '#ffd166' : 'var(--accent3)'
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>Score</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color }}>{score}/10</span>
      </div>
      <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '2px', transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

export default function InterviewResult() {
  const { state } = useLocation()

  if (!state) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text2)' }}>
      No result data. <Link to="/interview" style={{ color: 'var(--accent)' }}>Take an interview</Link>
    </div>
  )

  const { field, results, overall_score } = state
  const overallColor = overall_score >= 7 ? 'var(--accent)' : overall_score >= 5 ? '#ffd166' : 'var(--accent3)'
  const verdict = overall_score >= 7 ? 'Excellent' : overall_score >= 5 ? 'Average' : 'Needs Improvement'

  return (
    <main style={styles.main}>
      <div style={styles.header}>
        <div style={styles.label}>{field.replace(/([A-Z])/g, ' $1').trim()} — Interview Results</div>
        <div style={{ ...styles.verdict, color: overallColor, borderColor: overallColor }}>
          {verdict.toUpperCase()}
        </div>
      </div>

      <div style={styles.scoreCard}>
        <div style={{ ...styles.bigScore, color: overallColor }}>
          {overall_score}
          <span style={{ color: 'var(--text3)', fontSize: '2rem', fontFamily: 'var(--font-mono)' }}>/10</span>
        </div>
        <div style={styles.scoreSub}>Overall AI Score</div>
      </div>

      <div style={styles.breakdown}>
        <div style={styles.sectionLabel}>Question Breakdown</div>
        {results.map((r, i) => (
          <div key={i} style={styles.resultCard}>
            <div style={styles.resultHeader}>
              <span style={styles.qLabel}>Q{i + 1}</span>
              <span style={styles.qText}>{r.question}</span>
            </div>
            <div style={styles.answerBlock}>
              <div style={styles.answerLabel}>Your Answer</div>
              <div style={styles.answerText}>{r.answer || <em style={{ color: 'var(--text3)' }}>No answer provided</em>}</div>
            </div>
            <div style={styles.feedbackBlock}>
              <div style={styles.feedbackLabel}>AI Feedback</div>
              <div style={styles.feedbackText}>{r.feedback}</div>
            </div>
            <ScoreBar score={r.score} />
          </div>
        ))}
      </div>

      <div style={styles.actions}>
        <Link to="/interview" style={styles.btnPrimary}>Try Another Field →</Link>
        <Link to="/dashboard" style={styles.btnSecondary}>View All Results</Link>
        <Link to="/" style={styles.btnSecondary}>Home</Link>
      </div>
    </main>
  )
}

const styles = {
  main: { maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' },
  label: { fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text3)' },
  verdict: {
    fontSize: '0.75rem', letterSpacing: '0.18em', fontWeight: 700,
    border: '1px solid', padding: '0.25rem 0.75rem', borderRadius: '2px',
  },
  scoreCard: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: '4px', padding: '3rem', textAlign: 'center', marginBottom: '3rem',
  },
  bigScore: { fontFamily: 'var(--font-display)', fontSize: '6rem', fontWeight: 800, lineHeight: 1 },
  scoreSub: { color: 'var(--text2)', fontSize: '0.85rem', marginTop: '0.75rem', letterSpacing: '0.1em' },
  breakdown: { marginBottom: '2.5rem' },
  sectionLabel: {
    fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase',
    color: 'var(--text3)', marginBottom: '1.25rem',
  },
  resultCard: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: '4px', padding: '1.75rem', marginBottom: '1rem',
  },
  resultHeader: { display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' },
  qLabel: {
    fontFamily: 'var(--font-display)', fontWeight: 800,
    fontSize: '0.85rem', color: 'var(--accent)', flexShrink: 0,
    paddingTop: '0.1rem',
  },
  qText: { fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text)' },
  answerBlock: {
    background: 'var(--surface2)', borderRadius: '3px',
    padding: '1rem 1.25rem', marginBottom: '0.75rem',
  },
  answerLabel: { fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.4rem' },
  answerText: { fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text2)' },
  feedbackBlock: {
    background: 'rgba(0,196,255,0.04)', border: '1px solid rgba(0,196,255,0.15)',
    borderRadius: '3px', padding: '1rem 1.25rem', marginBottom: '0.75rem',
  },
  feedbackLabel: { fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent2)', marginBottom: '0.4rem' },
  feedbackText: { fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text)' },
  actions: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  btnPrimary: {
    background: 'var(--accent)', color: '#000',
    padding: '0.85rem 2rem', fontWeight: 700,
    fontSize: '0.85rem', letterSpacing: '0.08em', borderRadius: '2px',
  },
  btnSecondary: {
    border: '1px solid var(--border)', color: 'var(--text2)',
    padding: '0.85rem 1.5rem', fontSize: '0.85rem',
    letterSpacing: '0.08em', borderRadius: '2px',
  }
}
