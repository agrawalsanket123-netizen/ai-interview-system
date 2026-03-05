import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const TAGLINES = ['Powered by Claude AI', 'Voice-Aware', 'Real-time Scoring', 'Industry-Aligned']

export default function Home() {
  const [tagIdx, setTagIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTagIdx(i => (i + 1) % TAGLINES.length), 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <main style={styles.main}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.badge}>{TAGLINES[tagIdx]}</div>
        <h1 style={styles.h1}>
          Automated<br />
          <span style={{ color: 'var(--accent)' }}>AI Interview</span><br />
          System
        </h1>
        <p style={styles.sub}>
          Aptitude tests &amp; technical interviews scored in real-time<br />
          by AI — no human bias, instant feedback.
        </p>
        <div style={styles.ctas}>
          <Link to="/aptitude" style={styles.btnPrimary}>Start Aptitude Test →</Link>
          <Link to="/interview" style={styles.btnSecondary}>Go to Interview →</Link>
        </div>
      </section>

      {/* Steps */}
      <section style={styles.steps}>
        {[
          { n: '01', title: 'Aptitude Test', desc: 'Answer 5 logic & reasoning questions to qualify for the interview round.' },
          { n: '02', title: 'Pick Your Field', desc: 'Choose from Data Analysis, Web Dev, Machine Learning, or Cybersecurity.' },
          { n: '03', title: 'Answer Questions', desc: 'Type your answers to 5 technical interview questions for your field.' },
          { n: '04', title: 'Get AI Feedback', desc: 'Claude AI evaluates your responses and gives a score + actionable feedback instantly.' },
        ].map(s => (
          <div key={s.n} style={styles.card}>
            <div style={styles.cardNum}>{s.n}</div>
            <div style={styles.cardTitle}>{s.title}</div>
            <div style={styles.cardDesc}>{s.desc}</div>
          </div>
        ))}
      </section>

      {/* Fields */}
      <section style={styles.fieldSection}>
        <div style={styles.sectionLabel}>Available Fields</div>
        <div style={styles.fields}>
          {['DataAnalysis', 'WebDevelopment', 'MachineLearning', 'CyberSecurity'].map(f => (
            <Link to={`/interview/${f}`} key={f} style={styles.fieldPill}>
              {f.replace(/([A-Z])/g, ' $1').trim()}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

const styles = {
  main: { padding: '0 2.5rem 4rem', maxWidth: '1100px', margin: '0 auto' },
  hero: {
    paddingTop: '5rem',
    paddingBottom: '4rem',
    borderBottom: '1px solid var(--border)',
    marginBottom: '4rem',
  },
  badge: {
    display: 'inline-block',
    fontSize: '0.7rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    border: '1px solid var(--accent)',
    padding: '0.3rem 0.8rem',
    borderRadius: '2px',
    marginBottom: '2rem',
    transition: 'all 0.3s',
  },
  h1: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(3rem, 8vw, 6rem)',
    fontWeight: 800,
    lineHeight: 1.05,
    marginBottom: '1.5rem',
    letterSpacing: '-0.02em',
  },
  sub: {
    color: 'var(--text2)',
    fontSize: '1rem',
    lineHeight: 1.7,
    maxWidth: '480px',
    marginBottom: '2.5rem',
  },
  ctas: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  btnPrimary: {
    background: 'var(--accent)',
    color: '#000',
    padding: '0.85rem 2rem',
    fontWeight: 700,
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
    borderRadius: '2px',
    display: 'inline-block',
    transition: 'opacity 0.2s',
  },
  btnSecondary: {
    border: '1px solid var(--border)',
    color: 'var(--text)',
    padding: '0.85rem 2rem',
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
    borderRadius: '2px',
    display: 'inline-block',
    transition: 'border-color 0.2s',
  },
  steps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginBottom: '4rem',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '2rem 1.5rem',
  },
  cardNum: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.5rem',
    fontWeight: 800,
    color: 'var(--text3)',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.1rem',
    marginBottom: '0.75rem',
    color: 'var(--text)',
  },
  cardDesc: { fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.6 },
  fieldSection: { marginBottom: '4rem' },
  sectionLabel: {
    fontSize: '0.7rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--text3)',
    marginBottom: '1.25rem',
  },
  fields: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  fieldPill: {
    border: '1px solid var(--border)',
    color: 'var(--text2)',
    padding: '0.6rem 1.25rem',
    fontSize: '0.8rem',
    letterSpacing: '0.06em',
    borderRadius: '2px',
    transition: 'all 0.2s',
  }
}
