import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import BASE_URL from '../api'

export default function AptitudeTest() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${BASE_URL}/api/aptitude/questions`).then(r => {
      setQuestions(r.data.questions)
      setLoading(false)
    })
  }, [])

  const select = (id, opt) => setAnswers(a => ({ ...a, [id]: opt }))

  const submit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting.')
      return
    }
    setSubmitting(true)
    const ordered = questions.map(q => answers[q.id] || '')
    const res = await axios.post(`${BASE_URL}/api/aptitude/submit`, { answers: ordered })
    navigate('/aptitude/result', { state: res.data })
  }

  if (loading) return <PageLoader />

  const q = questions[current]

  return (
    <main style={styles.main}>
      <div style={styles.header}>
        <div style={styles.label}>Aptitude Test</div>
        <div style={styles.progress}>
          {questions.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                ...styles.dot,
                background: answers[i] !== undefined
                  ? 'var(--accent)'
                  : i === current ? 'var(--text2)' : 'var(--border)',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
        <div style={styles.counter}>{current + 1} / {questions.length}</div>
      </div>

      <div style={styles.qCard}>
        <div style={styles.qNum}>Q{current + 1}</div>
        <div style={styles.qText}>{q.question}</div>

        <div style={styles.options}>
          {Object.entries(q.options).map(([key, val]) => (
            <button
              key={key}
              onClick={() => select(current, key)}
              style={{
                ...styles.option,
                ...(answers[current] === key ? styles.optionSelected : {})
              }}
            >
              <span style={styles.optKey}>{key}</span>
              <span>{val}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={styles.navRow}>
        <button
          style={{ ...styles.navBtn, opacity: current === 0 ? 0.3 : 1 }}
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={current === 0}
        >← Prev</button>

        {current < questions.length - 1 ? (
          <button
            style={styles.navBtn}
            onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}
          >Next →</button>
        ) : (
          <button
            style={styles.submitBtn}
            onClick={submit}
            disabled={submitting}
          >{submitting ? 'Evaluating...' : 'Submit Test →'}</button>
        )}
      </div>
    </main>
  )
}

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ color: 'var(--text2)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
        LOADING...
      </div>
    </div>
  )
}

const styles = {
  main: { maxWidth: '720px', margin: '0 auto', padding: '3rem 2rem' },
  header: { display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' },
  label: {
    fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase',
    color: 'var(--accent)', fontFamily: 'var(--font-mono)',
  },
  progress: { display: 'flex', gap: '0.4rem', flex: 1 },
  dot: { width: '24px', height: '4px', borderRadius: '2px', transition: 'background 0.3s' },
  counter: { fontSize: '0.75rem', color: 'var(--text3)', fontFamily: 'var(--font-mono)' },
  qCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '2.5rem',
    marginBottom: '2rem',
  },
  qNum: {
    fontFamily: 'var(--font-display)',
    fontSize: '3rem', fontWeight: 800,
    color: 'var(--text3)', marginBottom: '1rem',
  },
  qText: { fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem', color: 'var(--text)' },
  options: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  option: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    background: 'var(--surface2)', border: '1px solid var(--border)',
    padding: '1rem 1.25rem', borderRadius: '3px',
    color: 'var(--text)', fontSize: '0.9rem', textAlign: 'left',
    transition: 'all 0.2s',
  },
  optionSelected: {
    border: '1px solid var(--accent)',
    background: 'rgba(0,255,135,0.05)',
    color: 'var(--accent)',
  },
  optKey: {
    fontFamily: 'var(--font-display)', fontWeight: 700,
    fontSize: '0.9rem', minWidth: '1.25rem', color: 'var(--text3)',
  },
  navRow: { display: 'flex', justifyContent: 'space-between' },
  navBtn: {
    background: 'transparent', border: '1px solid var(--border)',
    color: 'var(--text2)', padding: '0.75rem 1.5rem',
    fontSize: '0.8rem', letterSpacing: '0.08em', borderRadius: '2px',
    transition: 'all 0.2s',
  },
  submitBtn: {
    background: 'var(--accent)', color: '#000',
    border: 'none', padding: '0.75rem 2rem',
    fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em',
    borderRadius: '2px', transition: 'opacity 0.2s',
  }
}
