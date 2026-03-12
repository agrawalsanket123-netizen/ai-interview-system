import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useState, useEffect } from 'react'

const FIELDS = [
  { id: 'DataAnalysis', label: 'Data Analysis', desc: 'EDA, visualization, statistics, pandas', icon: '📊', color: 'rgba(167,212,245,0.12)', accent: 'var(--accent3)' },
  { id: 'WebDevelopment', label: 'Web Development', desc: 'HTML, CSS, JavaScript, React, APIs', icon: '🌐', color: 'rgba(139,167,245,0.12)', accent: 'var(--accent)' },
  { id: 'MachineLearning', label: 'Machine Learning', desc: 'Models, training, evaluation, ML theory', icon: '🤖', color: 'rgba(184,167,245,0.12)', accent: 'var(--accent2)' },
  { id: 'CyberSecurity', label: 'Cyber Security', desc: 'Encryption, firewalls, threats, networks', icon: '🔒', color: 'rgba(123,229,192,0.12)', accent: 'var(--success)' },
]

const WORDS = ['Aptitude Tests', 'AI Scoring', 'Voice Interviews', 'Instant Feedback']

export default function Home() {
  const { isLoggedIn } = useAuth()
  const [wordIdx, setWordIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setWordIdx(i => (i + 1) % WORDS.length); setVisible(true) }, 300)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <main style={s.main} className="page-enter">

      {/* Hero */}
      <section style={s.hero}>
        {/* Glow behind hero */}
        <div style={s.heroGlow} />

        <div style={s.heroContent}>
          <div style={s.badge} className="stagger-1">
            <span style={s.badgeDot} />
            AI-Powered Technical Assessment
          </div>

          <h1 style={s.h1} className="stagger-2">
            Ace Your Next<br />
            <span style={s.h1Gradient}>Technical Interview</span>
          </h1>

          <div style={s.rotatingTag} className="stagger-3">
            <span style={{ ...s.rotatingWord, opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}>
              {WORDS[wordIdx]}
            </span>
          </div>

          <p style={s.sub} className="stagger-3">
            Practice with AI-scored aptitude tests and domain-specific technical interviews.
            Get instant, detailed feedback. Build real confidence.
          </p>

          <div style={s.ctas} className="stagger-4">
            <Link to={isLoggedIn ? '/aptitude' : '/register'} style={s.btnPrimary} className="btn-glow">
              {isLoggedIn ? 'Start Test →' : 'Get Started Free →'}
            </Link>
            <Link to={isLoggedIn ? '/dashboard' : '/login'} style={s.btnSecondary}>
              {isLoggedIn ? 'View Results' : 'Sign In'}
            </Link>
          </div>
        </div>

        {/* Floating stats */}
        <div style={s.statsGrid}>
          {[
            { val: '40+', label: 'Questions', color: 'var(--accent)', bg: 'rgba(139,167,245,0.08)' },
            { val: '4', label: 'Tech Fields', color: 'var(--accent2)', bg: 'rgba(184,167,245,0.08)' },
            { val: 'AI', label: 'Scoring', color: 'var(--accent3)', bg: 'rgba(167,212,245,0.08)' },
            { val: '∞', label: 'Practice', color: 'var(--success)', bg: 'rgba(123,229,192,0.08)' },
          ].map((st, i) => (
            <div key={i} style={{ ...s.statCard, background: st.bg, border: `1px solid ${st.color}22` }}
              className={`stagger-${i + 1}`}>
              <div style={{ ...s.statVal, color: st.color }}>{st.val}</div>
              <div style={s.statLabel}>{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={s.section}>
        <div style={s.sectionLabel}>How It Works</div>
        <h2 style={s.sectionTitle}>Four steps to interview-ready</h2>
        <div style={s.stepsGrid}>
          {[
            { n: '01', title: 'Create Account', desc: 'Sign up free. Your results are saved privately and securely.', color: 'var(--accent)', bg: 'rgba(139,167,245,0.06)' },
            { n: '02', title: 'Aptitude Test', desc: '10 randomized logic & reasoning questions with instant scoring.', color: 'var(--accent2)', bg: 'rgba(184,167,245,0.06)' },
            { n: '03', title: 'Pick Your Field', desc: 'Choose from Data Analysis, Web Dev, ML, or Cyber Security.', color: 'var(--accent3)', bg: 'rgba(167,212,245,0.06)' },
            { n: '04', title: 'Get AI Feedback', desc: 'Each answer scored 0–10 with detailed improvement suggestions.', color: 'var(--success)', bg: 'rgba(123,229,192,0.06)' },
          ].map((st, i) => (
            <div key={i} style={{ ...s.stepCard, background: st.bg, borderColor: st.color + '22' }} className="card-hover">
              <div style={{ ...s.stepNum, color: st.color }}>{st.n}</div>
              <div style={s.stepTitle}>{st.title}</div>
              <div style={s.stepDesc}>{st.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Fields */}
      <section style={s.section}>
        <div style={s.sectionLabel}>Interview Fields</div>
        <h2 style={s.sectionTitle}>Choose your domain</h2>
        <div style={s.fieldsGrid}>
          {FIELDS.map((f, i) => (
            <Link key={f.id} to={isLoggedIn ? `/interview/${f.id}` : '/login'}
              style={{ ...s.fieldCard, animationDelay: `${i * 0.08}s` }}
              className="card-hover"
              onMouseEnter={e => { e.currentTarget.style.background = f.color; e.currentTarget.style.borderColor = f.accent + '55' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <div style={s.fieldIconWrap}>
                <span style={s.fieldIcon}>{f.icon}</span>
              </div>
              <div style={s.fieldName}>{f.label}</div>
              <div style={s.fieldDesc}>{f.desc}</div>
              <div style={{ ...s.fieldArrow, color: f.accent }}>Start →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!isLoggedIn && (
        <section style={s.ctaSection}>
          <div style={s.ctaGlow} />
          <h2 style={s.ctaTitle}>Ready to level up?</h2>
          <p style={s.ctaSub}>Join and start practicing with AI feedback in minutes.</p>
          <Link to="/register" style={s.btnPrimary} className="btn-glow">Create Free Account →</Link>
        </section>
      )}
    </main>
  )
}

const s = {
  main: { maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 6rem', position: 'relative', zIndex: 1 },

  hero: { padding: '5rem 0 4rem', borderBottom: '1px solid var(--border)', marginBottom: '5rem', position: 'relative' },
  heroGlow: {
    position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
    width: '700px', height: '300px', pointerEvents: 'none',
    background: 'radial-gradient(ellipse, rgba(139,167,245,0.07) 0%, transparent 70%)',
  },
  heroContent: { position: 'relative', zIndex: 1, maxWidth: '680px' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    background: 'rgba(139,167,245,0.1)', border: '1px solid rgba(139,167,245,0.25)',
    borderRadius: '100px', padding: '0.35rem 1rem',
    fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)',
    marginBottom: '1.75rem', letterSpacing: '0.02em',
  },
  badgeDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: 'var(--accent)', animation: 'pulse-glow 2s infinite',
  },
  h1: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    fontWeight: 800, lineHeight: 1.1, color: 'var(--text)',
    marginBottom: '1.25rem', letterSpacing: '-0.02em',
  },
  h1Gradient: {
    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 50%, var(--accent3) 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  rotatingTag: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    marginBottom: '1.25rem', height: '28px',
  },
  rotatingWord: {
    background: 'rgba(139,167,245,0.15)', border: '1px solid rgba(139,167,245,0.3)',
    borderRadius: '6px', padding: '0.2rem 0.75rem',
    fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600,
    display: 'inline-block',
  },
  sub: { color: 'var(--text2)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '520px', marginBottom: '2.5rem' },
  ctas: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' },
  btnPrimary: {
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    color: '#07071a', padding: '0.875rem 1.875rem',
    fontWeight: 700, fontSize: '0.95rem', borderRadius: 'var(--radius)',
    display: 'inline-block', letterSpacing: '0.01em',
  },
  btnSecondary: {
    background: 'var(--surface2)', border: '1px solid var(--border2)',
    color: 'var(--text)', padding: '0.875rem 1.875rem',
    fontWeight: 500, fontSize: '0.95rem', borderRadius: 'var(--radius)',
    display: 'inline-block', transition: 'all 0.2s',
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', maxWidth: '600px' },
  statCard: { borderRadius: 'var(--radius)', padding: '1.25rem', textAlign: 'center' },
  statVal: { fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: '0.72rem', color: 'var(--text2)', marginTop: '0.35rem', fontWeight: 500 },

  section: { marginBottom: '5rem' },
  sectionLabel: {
    display: 'inline-block', background: 'var(--surface2)', border: '1px solid var(--border)',
    color: 'var(--text2)', fontSize: '0.72rem', fontWeight: 600,
    padding: '0.3rem 0.9rem', borderRadius: '100px', marginBottom: '1rem',
    textTransform: 'uppercase', letterSpacing: '0.08em',
  },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)', fontWeight: 700, color: 'var(--text)', marginBottom: '2rem' },

  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: 'var(--border)' },
  stepCard: { padding: '2rem 1.5rem', border: '1px solid transparent', transition: 'all 0.2s' },
  stepNum: { fontFamily: 'var(--font-display)', fontSize: '2.75rem', fontWeight: 800, lineHeight: 1, marginBottom: '0.75rem', opacity: 0.8 },
  stepTitle: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.5rem' },
  stepDesc: { fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.65 },

  fieldsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(235px, 1fr))', gap: '1rem' },
  fieldCard: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '1.75rem',
    display: 'block', transition: 'all 0.25s',
  },
  fieldIconWrap: {
    width: '48px', height: '48px', borderRadius: '12px',
    background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '1.25rem', fontSize: '1.4rem',
  },
  fieldIcon: {},
  fieldName: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.4rem' },
  fieldDesc: { fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '1.25rem' },
  fieldArrow: { fontSize: '0.875rem', fontWeight: 700 },

  ctaSection: {
    background: 'linear-gradient(135deg, rgba(139,167,245,0.08) 0%, rgba(184,167,245,0.08) 100%)',
    border: '1px solid var(--border2)', borderRadius: 'var(--radius-lg)',
    padding: '4rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
  },
  ctaGlow: {
    position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)',
    width: '400px', height: '300px', pointerEvents: 'none',
    background: 'radial-gradient(ellipse, rgba(139,167,245,0.1) 0%, transparent 70%)',
  },
  ctaTitle: { fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', position: 'relative' },
  ctaSub: { color: 'var(--text2)', fontSize: '1rem', marginBottom: '2rem', position: 'relative' },
}
