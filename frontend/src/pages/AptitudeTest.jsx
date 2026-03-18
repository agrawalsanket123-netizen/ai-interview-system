import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import BASE_URL from '../api'
import { useAuth } from '../AuthContext'

const DIFFICULTY_STYLES = {
  Easy: { label: '🟢 Easy', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
  Medium: { label: '🟡 Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  Hard: { label: '🔴 Hard', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
}

const TOTAL_SECONDS = 60 * 60

function useTimer(onExpire, started) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!started) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); onExpire(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [started])

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')
  const isWarning = timeLeft <= 300
  const isDanger = timeLeft <= 60

  return { mins, secs, isWarning, isDanger }
}

export default function AptitudeTest() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [current, setCurrent] = useState(0)
  const [started, setStarted] = useState(false)
  const navigate = useNavigate()
  const { token } = useAuth()

  const submit = async (auto = false) => {
    if (!auto && Object.keys(answers).length < questions.length) {
      alert('Please answer all questions.'); return
    }
    setSubmitting(true)
    const ordered = questions.map(q => ({
  question: q.question,
  answer: answers[q.id] || '',
  correct_answer: q.correct_answer || ''
}))
const res = await axios.post(`${BASE_URL}/api/aptitude/submit`, { answers: ordered }, { headers: { Authorization: `Bearer ${token}` } })
    navigate('/aptitude/result', { state: res.data })
  }

  const { mins, secs, isWarning, isDanger } = useTimer(() => submit(true), started)

  useEffect(() => {
    axios.get(`${BASE_URL}/api/aptitude/questions`).then(r => {
      setQuestions(r.data.questions); setLoading(false)
    })
  }, [])

  const select = (id, opt) => setAnswers(a => ({ ...a, [id]: opt }))

  if (loading) return <Loader text="Loading questions..." />

  if (!started) return (
    <main style={ss.main} className="page-enter">
      <div style={ss.card}>
        <div style={ss.icon}>📝</div>
        <h2 style={ss.title}>Aptitude Test</h2>
        <p style={ss.sub}>You will be asked <strong>30 questions</strong> divided into Easy, Medium and Hard levels.</p>
        <div style={ss.infoGrid}>
  <div style={ss.infoItem}><span style={ss.infoIcon}>⏱</span><span style={ss.infoLabel}>60 Minutes</span></div>
  <div style={ss.infoItem}><span style={ss.infoIcon}>📋</span><span style={ss.infoLabel}>30 Questions</span></div>
  <div style={ss.infoItem}><span style={ss.infoIcon}>🤖</span><span style={ss.infoLabel}>Auto Submit</span></div>
  <div style={ss.infoItem}><span style={ss.infoIcon}>🟢</span><span style={ss.infoLabel}>10 Easy</span></div>
  <div style={ss.infoItem}><span style={ss.infoIcon}>🟡</span><span style={ss.infoLabel}>10 Medium</span></div>
  <div style={ss.infoItem}><span style={ss.infoIcon}>🔴</span><span style={ss.infoLabel}>10 Hard</span></div>
</div>
        <p style={ss.warning}>⚠️ Timer starts as soon as you click Start Test. Do not refresh the page.</p>
        <button style={ss.startBtn} className="btn-glow" onClick={() => setStarted(true)}>
          Start Test →
        </button>
      </div>
    </main>
  )

  const q = questions[current]
  const answered = Object.keys(answers).length
  const diff = DIFFICULTY_STYLES[q.difficulty] || DIFFICULTY_STYLES['Easy']
  const timerColor = isDanger ? '#ef4444' : isWarning ? '#f59e0b' : 'var(--accent)'
  const timerBg = isDanger ? 'rgba(239,68,68,0.1)' : isWarning ? 'rgba(245,158,11,0.1)' : 'rgba(91,141,239,0.08)'
  const timerBorder = isDanger ? 'rgba(239,68,68,0.3)' : isWarning ? 'rgba(245,158,11,0.3)' : 'rgba(91,141,239,0.2)'

  return (
    <main style={s.main} className="page-enter page-pad">
      <div style={s.topBar}>
        <div style={{ ...s.topBarFill, width: `${(answered / questions.length) * 100}%` }} />
      </div>

      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.tag}>Aptitude Test</div>
          <div style={s.qCounterRow}>
            <div style={s.qCounter}>Question {current + 1} of {questions.length}</div>
            <div style={{ ...s.diffBadge, color: diff.color, background: diff.bg, border: `1px solid ${diff.border}` }}>
              {diff.label}
            </div>
          </div>
        </div>

        <div style={{ ...s.timerBox, color: timerColor, background: timerBg, border: `1px solid ${timerBorder}`, animation: isDanger ? 'pulse-glow 1s infinite' : 'none' }}>
          <span>⏱</span>
          <span style={s.timerText}>{mins}:{secs}</span>
          {isWarning && <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>{isDanger ? '⚠️ Hurry!' : 'Ending soon'}</span>}
        </div>

        <div style={s.dots}>
          {questions.map((_, i) => (
            <div key={i} onClick={() => setCurrent(i)} style={{
              ...s.dot,
              background: answers[i] !== undefined ? 'var(--accent)' : i === current ? 'var(--accent2)' : 'var(--surface3)',
              boxShadow: i === current ? '0 0 8px var(--accent-glow)' : 'none',
            }} title={`Q${i + 1}`} />
          ))}
        </div>
      </div>

      <div style={s.qCard} className="stagger-1">
        <div style={s.qNumRow}>
          <div style={s.qNum}>Q{current + 1}</div>
          <div style={{ ...s.diffBadgeLarge, color: diff.color, background: diff.bg, border: `1px solid ${diff.border}` }}>
            {diff.label}
          </div>
        </div>
        <div style={s.qText}>{q.question}</div>
        <div style={s.options}>
          {Object.entries(q.options).map(([key, val]) => (
            <button key={key} onClick={() => select(current, key)} style={{
              ...s.option,
              ...(answers[current] === key ? s.optionSelected : {}),
            }} className="card-hover">
              <span style={{ ...s.optKey, color: answers[current] === key ? 'var(--accent)' : 'var(--text3)' }}>{key}</span>
              <span>{val}</span>
              {answers[current] === key && <span style={s.checkMark}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={s.navRow} className="nav-row-flex">
        <button style={{ ...s.navBtn, opacity: current === 0 ? 0.3 : 1 }}
          onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>
          ← Prev
        </button>
        <span style={s.ansCount}>{answered}/{questions.length} answered</span>
        {current < questions.length - 1 ? (
          <button style={s.navBtn} onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}>Next →</button>
        ) : (
          <button style={{ ...s.submitBtn, opacity: submitting ? 0.7 : 1 }} className="btn-glow" onClick={() => submit(false)} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Test →'}
          </button>
        )}
      </div>
    </main>
  )
}

function Loader({ text }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
      <div style={{ width: '32px', height: '32px', border: '3px solid var(--border2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>{text}</div>
    </div>
  )
}

const ss = {
  main: { maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '3rem', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.06)', width: '100%' },
  icon: { fontSize: '3rem', marginBottom: '1rem' },
  title: { fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' },
  sub: { color: 'var(--text2)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' },
  infoItem: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' },
  infoIcon: { fontSize: '1.25rem' },
  infoLabel: { fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)' },
  warning: { background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#92400e', marginBottom: '2rem' },
  startBtn: { background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff', border: 'none', padding: '0.875rem 2.5rem', fontWeight: 700, fontSize: '1rem', borderRadius: 'var(--radius)', cursor: 'pointer', display: 'inline-block' },
}

const s = {
  main: { maxWidth: '720px', margin: '0 auto', padding: '0 2rem 4rem' },
  topBar: { height: '3px', background: 'var(--surface2)', marginBottom: '2.5rem', borderRadius: '2px', overflow: 'hidden' },
  topBarFill: { height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--accent2))', borderRadius: '2px', transition: 'width 0.4s ease' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  headerLeft: {},
  tag: { fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: '0.3rem' },
  qCounterRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' },
  qCounter: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text2)' },
  diffBadge: { fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '100px' },
  diffBadgeLarge: { fontSize: '0.8rem', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: '100px' },
  timerBox: { display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', borderRadius: '100px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', transition: 'all 0.3s' },
  timerText: { fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.05em' },
  dots: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap' },
  dot: { width: '28px', height: '5px', borderRadius: '3px', cursor: 'pointer', transition: 'all 0.3s' },
  qCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2.5rem', marginBottom: '2rem' },
  qNumRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' },
  qNum: { fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--surface3)', lineHeight: 1 },
  qText: { fontSize: '1.1rem', lineHeight: 1.65, marginBottom: '2rem', color: 'var(--text)', fontWeight: 500 },
  options: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  option: { display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface2)', border: '1.5px solid var(--border)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.9rem', textAlign: 'left', transition: 'all 0.2s', cursor: 'pointer' },
  optionSelected: { border: '1.5px solid var(--accent)', background: 'rgba(91,141,239,0.08)', color: 'var(--text)' },
  optKey: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem', minWidth: '1.25rem' },
  checkMark: { marginLeft: 'auto', color: 'var(--accent)', fontWeight: 700 },
  navRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navBtn: { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '0.75rem 1.5rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', transition: 'all 0.2s', cursor: 'pointer' },
  ansCount: { fontSize: '0.8rem', color: 'var(--text3)' },
  submitBtn: { background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff', border: 'none', padding: '0.75rem 2rem', fontWeight: 700, fontSize: '0.9rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' },
}