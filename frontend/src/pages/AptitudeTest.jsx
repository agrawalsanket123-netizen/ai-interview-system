import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import BASE_URL from '../api'
import { useAuth } from '../AuthContext'

export default function AptitudeTest() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()
  const { token } = useAuth()

  useEffect(() => {
    axios.get(`${BASE_URL}/api/aptitude/questions`).then(r => {
      setQuestions(r.data.questions); setLoading(false)
    })
  }, [])

  const select = (id, opt) => setAnswers(a => ({ ...a, [id]: opt }))

  const submit = async () => {
    if (Object.keys(answers).length < questions.length) { alert('Please answer all questions.'); return }
    setSubmitting(true)
    const ordered = questions.map(q => answers[q.id] || '')
    const res = await axios.post(`${BASE_URL}/api/aptitude/submit`, { answers: ordered }, { headers: { Authorization: `Bearer ${token}` } })
    navigate('/aptitude/result', { state: res.data })
  }

  if (loading) return <Loader text="Loading questions..." />

  const q = questions[current]
  const answered = Object.keys(answers).length

  return (
    <main style={s.main} className="page-enter">
      {/* Top progress bar */}
      <div style={s.topBar}>
        <div style={{ ...s.topBarFill, width: `${(answered / questions.length) * 100}%` }} />
      </div>

      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.tag}>Aptitude Test</div>
          <div style={s.qCounter}>Question {current + 1} of {questions.length}</div>
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
        <div style={s.qNum}>Q{current + 1}</div>
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

      <div style={s.navRow}>
        <button style={{ ...s.navBtn, opacity: current === 0 ? 0.3 : 1 }}
          onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>
          ← Prev
        </button>
        <span style={s.ansCount}>{answered}/{questions.length} answered</span>
        {current < questions.length - 1 ? (
          <button style={s.navBtn} onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}>Next →</button>
        ) : (
          <button style={{ ...s.submitBtn, opacity: submitting ? 0.7 : 1 }} className="btn-glow" onClick={submit} disabled={submitting}>
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

const s = {
  main: { maxWidth: '720px', margin: '0 auto', padding: '0 2rem 4rem' },
  topBar: { height: '3px', background: 'var(--surface2)', marginBottom: '2.5rem', borderRadius: '2px', overflow: 'hidden' },
  topBarFill: { height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--accent2))', borderRadius: '2px', transition: 'width 0.4s ease' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  headerLeft: {},
  tag: { fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: '0.3rem' },
  qCounter: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text2)' },
  dots: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap' },
  dot: { width: '28px', height: '5px', borderRadius: '3px', cursor: 'pointer', transition: 'all 0.3s' },
  qCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2.5rem', marginBottom: '2rem' },
  qNum: { fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--surface3)', marginBottom: '1rem', lineHeight: 1 },
  qText: { fontSize: '1.1rem', lineHeight: 1.65, marginBottom: '2rem', color: 'var(--text)', fontWeight: 500 },
  options: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  option: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    background: 'var(--surface2)', border: '1.5px solid var(--border)',
    padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)',
    color: 'var(--text)', fontSize: '0.9rem', textAlign: 'left',
    transition: 'all 0.2s', cursor: 'pointer',
  },
  optionSelected: { border: '1.5px solid var(--accent)', background: 'rgba(91,106,191,0.08)', color: 'var(--text)' },
  optKey: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem', minWidth: '1.25rem' },
  checkMark: { marginLeft: 'auto', color: 'var(--accent)', fontWeight: 700 },
  navRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navBtn: { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '0.75rem 1.5rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', transition: 'all 0.2s', cursor: 'pointer' },
  ansCount: { fontSize: '0.8rem', color: 'var(--text3)' },
  submitBtn: { background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff', border: 'none', padding: '0.75rem 2rem', fontWeight: 700, fontSize: '0.9rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' },
}
