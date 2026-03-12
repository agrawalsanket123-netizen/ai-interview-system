import { useLocation, Link } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function InterviewResult() {
  const { state } = useLocation()
  useScrollAnimation()

  if (!state) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text2)' }}>No data. <Link to="/interview" style={{ color: 'var(--accent)' }}>Take interview</Link></div>

  const { field, results, overall_score } = state
  const verdict = overall_score >= 7 ? 'Excellent' : overall_score >= 5 ? 'Good' : 'Needs Practice'
  const scoreColor = overall_score >= 7 ? 'var(--success)' : overall_score >= 5 ? 'var(--warning)' : 'var(--danger)'

  return (
    <main style={s.main} className="page-enter">
      <div style={s.header} className="scroll-animate">
        <div>
          <div style={s.tag}>{field.replace(/([A-Z])/g, ' $1').trim()} · Interview Results</div>
          <h1 style={s.title}>Your Results</h1>
        </div>
        <div style={{ ...s.verdict, color: scoreColor, background: `${scoreColor}18`, border: `1px solid ${scoreColor}44` }}>
          {verdict}
        </div>
      </div>

      <div style={s.scoreCard} className="scroll-animate">
        <div style={s.scoreLeft}>
          <div style={{ ...s.bigScore, color: scoreColor }}>{overall_score}</div>
          <div style={s.scoreOut}>/ 10</div>
        </div>
        <div style={s.scoreRight}>
          <div style={s.scoreLabel}>Overall AI Score</div>
          <div style={s.bar}><div style={{ ...s.barFill, width: `${(overall_score / 10) * 100}%`, background: `linear-gradient(90deg, ${scoreColor}, var(--accent))` }} /></div>
          <div style={s.hint}>
            {overall_score >= 7 ? '🎉 Excellent! You are interview-ready.' : overall_score >= 5 ? '📚 Good effort! Review feedback below to improve.' : '💪 Keep practicing! Study each AI feedback carefully.'}
          </div>
        </div>
      </div>

      <div style={s.sectionLabel} className="scroll-animate">Question Breakdown</div>
      {(results || []).map((r, i) => {
        const sc = r.score || 0
        const c = sc >= 7 ? 'var(--success)' : sc >= 5 ? 'var(--warning)' : 'var(--danger)'
        return (
          <div key={i} style={s.resultCard} className="scroll-animate">
            <div style={s.resultTop}>
              <div style={s.qBadge}>Q{i + 1}</div>
              <div style={s.qText}>{r.question}</div>
              <div style={{ ...s.scorePill, color: c, background: `${c}18`, border: `1px solid ${c}44` }}>{sc}/10</div>
            </div>
            <div style={s.answerBox}>
              <div style={s.boxLabel}>Your Answer</div>
              <div style={s.boxText}>{r.answer || <em style={{ color: 'var(--text3)' }}>No answer</em>}</div>
            </div>
            <div style={s.feedbackBox}>
              <div style={{ ...s.boxLabel, color: 'var(--accent2)' }}>✦ AI Feedback</div>
              <div style={s.boxText}>{r.feedback}</div>
            </div>
            <div style={s.barRow}>
              <div style={s.barTrack}><div style={{ ...s.barFill2, width: `${(sc / 10) * 100}%`, background: `linear-gradient(90deg, ${c}, var(--accent))` }} /></div>
              <span style={{ color: c, fontSize: '0.8rem', fontWeight: 700 }}>{sc}/10</span>
            </div>
          </div>
        )
      })}

      <div style={s.actions} className="scroll-animate">
        <Link to="/interview" style={s.btnPrimary} className="btn-glow">Try Another Field →</Link>
        <Link to="/dashboard" style={s.btnSecondary}>View Dashboard</Link>
        <Link to="/" style={s.btnSecondary}>Home</Link>
      </div>
    </main>
  )
}

const s = {
  main: { maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  tag: { fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: '0.5rem' },
  title: { fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--text)' },
  verdict: { padding: '0.4rem 1.1rem', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 600 },
  scoreCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' },
  scoreLeft: { textAlign: 'center', minWidth: '100px' },
  bigScore: { fontFamily: 'var(--font-display)', fontSize: '5rem', fontWeight: 800, lineHeight: 1 },
  scoreOut: { color: 'var(--text3)', fontSize: '1rem' },
  scoreRight: { flex: 1 },
  scoreLabel: { fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.75rem' },
  bar: { height: '8px', background: 'var(--surface2)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' },
  barFill: { height: '100%', borderRadius: '4px', transition: 'width 1s ease' },
  hint: { fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.5 },
  sectionLabel: { fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: '1.25rem' },
  resultCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  resultTop: { display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1rem' },
  qBadge: { background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text2)', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '6px', flexShrink: 0 },
  qText: { flex: 1, fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.5, fontWeight: 500 },
  scorePill: { padding: '0.2rem 0.75rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 },
  answerBox: { background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', padding: '0.875rem 1rem', marginBottom: '0.75rem' },
  feedbackBox: { background: 'rgba(124,106,191,0.05)', border: '1px solid rgba(124,106,191,0.15)', borderRadius: 'var(--radius-sm)', padding: '0.875rem 1rem', marginBottom: '0.75rem' },
  boxLabel: { fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: '0.35rem' },
  boxText: { fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.65 },
  barRow: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  barTrack: { flex: 1, height: '5px', background: 'var(--surface2)', borderRadius: '3px', overflow: 'hidden' },
  barFill2: { height: '100%', borderRadius: '3px', transition: 'width 0.8s ease' },
  actions: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' },
  btnPrimary: { background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff', padding: '0.875rem 1.75rem', fontWeight: 700, fontSize: '0.9rem', borderRadius: 'var(--radius-sm)' },
  btnSecondary: { background: 'var(--surface)', border: '1px solid var(--border2)', color: 'var(--text)', padding: '0.875rem 1.5rem', fontSize: '0.9rem', fontWeight: 500, borderRadius: 'var(--radius-sm)' },
}
