import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Interview() {
  const { field } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const textRef = useRef(null)
  const recognitionRef = useRef(null)

  // ---------- TEXT TO SPEECH ----------
  const speak = (text) => {
    if (!voiceEnabled) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v =>
      v.name.includes('Google') || v.name.includes('David') || v.name.includes('Zira')
    )
    if (preferred) utterance.voice = preferred
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  // ---------- LOAD QUESTIONS ----------
  useEffect(() => {
    axios.get(`/api/interview/questions/${field}`).then(r => {
      setQuestions(r.data.questions)
      setLoading(false)
    }).catch(() => navigate('/interview'))
  }, [field])

  // Speak welcome + first question when questions load
  useEffect(() => {
    if (questions.length > 0 && voiceEnabled) {
      const fieldName = field.replace(/([A-Z])/g, ' $1').trim()
      const t = setTimeout(() => {
        speak(`Welcome to the ${fieldName} interview. I will read each question aloud. Question 1. ${questions[0]}`)
      }, 500)
      return () => clearTimeout(t)
    }
  }, [questions])

  // Speak question when navigating (but not on first load, handled above)
  const prevCurrentRef = useRef(null)
  useEffect(() => {
    if (questions.length > 0 && voiceEnabled && prevCurrentRef.current !== null && prevCurrentRef.current !== current) {
      const t = setTimeout(() => speak(`Question ${current + 1}. ${questions[current]}`), 300)
      return () => clearTimeout(t)
    }
    prevCurrentRef.current = current
  }, [current])

  // Cleanup on unmount
  useEffect(() => () => window.speechSynthesis.cancel(), [])

  // ---------- SPEECH RECOGNITION ----------
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser. Use Chrome.')
      return
    }
    stopSpeaking()
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.continuous = false
    rec.interimResults = false
    rec.lang = 'en-US'
    rec.onstart = () => setListening(true)
    rec.onend = () => setListening(false)
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setAnswers(a => ({ ...a, [current]: (a[current] || '') + ' ' + transcript }))
    }
    rec.start()
    recognitionRef.current = rec
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  const goToQuestion = (idx) => {
    stopSpeaking()
    prevCurrentRef.current = current
    setCurrent(idx)
  }

  // ---------- SUBMIT ----------
  const submit = async () => {
    const unanswered = questions.filter((_, i) => !answers[i] || answers[i].trim() === '')
    if (unanswered.length > 0) {
      speak(`Please answer all questions. ${unanswered.length} question remaining.`)
      alert(`Please answer all questions. ${unanswered.length} question(s) remaining.`)
      return
    }
    stopSpeaking()
    speak('Submitting your answers for AI evaluation. Please wait.')
    setSubmitting(true)
    const responses = questions.map((q, i) => ({ question: q, answer: answers[i] || '' }))
    try {
      const res = await axios.post('/api/interview/evaluate', { field, responses })
      navigate('/interview/result', { state: res.data })
    } catch (e) {
      speak('Evaluation failed. Please make sure the backend is running.')
      alert('Evaluation failed. Make sure the backend is running.')
      setSubmitting(false)
    }
  }

  if (loading) return <PageLoader />

  const q = questions[current]
  const allAnswered = questions.every((_, i) => answers[i] && answers[i].trim())

  return (
    <main style={styles.main}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.label}>{field.replace(/([A-Z])/g, ' $1').trim()} Interview</div>
          <div style={styles.counter}>Question {current + 1} of {questions.length}</div>
        </div>
        <div style={styles.rightHeader}>
          <button
            style={{
              ...styles.voiceToggle,
              background: voiceEnabled ? 'rgba(0,255,135,0.1)' : 'var(--surface2)',
              borderColor: voiceEnabled ? 'var(--accent)' : 'var(--border)',
              color: voiceEnabled ? 'var(--accent)' : 'var(--text3)',
            }}
            onClick={() => { if (voiceEnabled) stopSpeaking(); setVoiceEnabled(v => !v) }}
          >
            {voiceEnabled ? '🔊 Voice ON' : '🔇 Voice OFF'}
          </button>

          {voiceEnabled && (
            <button
              style={{
                ...styles.replayBtn,
                background: speaking ? 'rgba(255,107,107,0.1)' : 'var(--surface2)',
                borderColor: speaking ? 'var(--accent3)' : 'var(--border)',
                color: speaking ? 'var(--accent3)' : 'var(--text2)',
              }}
              onClick={() => speaking ? stopSpeaking() : speak(`Question ${current + 1}. ${q}`)}
            >
              {speaking ? '⏹ Stop' : '▶ Replay'}
            </button>
          )}

          <div style={styles.progress}>
            {questions.map((_, i) => (
              <div
                key={i}
                onClick={() => goToQuestion(i)}
                style={{
                  ...styles.dot,
                  background: answers[i] ? 'var(--accent)' : i === current ? 'var(--text2)' : 'var(--border)',
                  cursor: 'pointer',
                }}
                title={`Q${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Speaking indicator */}
      {speaking && (
        <div style={styles.speakingBanner}>
          <div style={styles.speakingWave}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ ...styles.bar, animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          Reading question aloud...
        </div>
      )}

      {/* Question Card */}
      <div style={styles.qCard}>
        <div style={styles.qNum}>Q{current + 1}</div>
        <div style={styles.qText}>{q}</div>

        <div style={styles.textareaWrapper}>
          <textarea
            ref={textRef}
            style={styles.textarea}
            rows={5}
            placeholder="Type your answer here, or use voice input below..."
            value={answers[current] || ''}
            onChange={e => setAnswers(a => ({ ...a, [current]: e.target.value }))}
          />
          <div style={styles.textareaFooter}>
            <span style={{ color: 'var(--text3)', fontSize: '0.7rem' }}>
              {(answers[current] || '').length} chars
            </span>
            <button
              style={{
                ...styles.micBtn,
                background: listening ? 'var(--accent3)' : 'var(--surface2)',
                color: listening ? '#fff' : 'var(--text2)',
              }}
              onClick={listening ? stopListening : startListening}
            >
              {listening ? '⏹ Stop Recording' : '🎤 Voice Answer'}
            </button>
          </div>
        </div>

        {listening && (
          <div style={styles.listeningBadge}>
            <span style={styles.pulse} /> Listening to your answer...
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={styles.navRow}>
        <button
          style={{ ...styles.navBtn, opacity: current === 0 ? 0.3 : 1 }}
          onClick={() => goToQuestion(Math.max(0, current - 1))}
          disabled={current === 0}
        >← Prev</button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {current < questions.length - 1 && (
            <button style={styles.navBtn} onClick={() => goToQuestion(current + 1)}>Next →</button>
          )}
          {allAnswered && (
            <button
              style={{ ...styles.submitBtn, opacity: submitting ? 0.7 : 1 }}
              onClick={submit}
              disabled={submitting}
            >
              {submitting ? 'Evaluating with AI...' : 'Submit for AI Evaluation →'}
            </button>
          )}
        </div>
      </div>

      {submitting && (
        <div style={styles.evaluatingBanner}>
          <div style={styles.spinner} />
          Claude AI is evaluating your answers... This may take a moment.
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        @keyframes soundBar { 0%,100% { height: 4px; } 50% { height: 18px; } }
      `}</style>
    </main>
  )
}

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ color: 'var(--text2)', fontSize: '0.85rem', letterSpacing: '0.1em' }}>LOADING QUESTIONS...</div>
    </div>
  )
}

const styles = {
  main: { maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' },
  header: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem',
  },
  label: { fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.4rem' },
  counter: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text2)' },
  rightHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' },
  voiceToggle: {
    border: '1px solid', padding: '0.35rem 0.85rem', fontSize: '0.75rem',
    borderRadius: '2px', transition: 'all 0.2s', letterSpacing: '0.05em', cursor: 'pointer',
  },
  replayBtn: {
    border: '1px solid', padding: '0.35rem 0.85rem', fontSize: '0.75rem',
    borderRadius: '2px', transition: 'all 0.2s', letterSpacing: '0.05em', cursor: 'pointer',
  },
  progress: { display: 'flex', gap: '0.4rem', paddingTop: '0.25rem' },
  dot: { width: '32px', height: '4px', borderRadius: '2px', transition: 'background 0.3s' },
  speakingBanner: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    background: 'rgba(0,255,135,0.04)', border: '1px solid rgba(0,255,135,0.15)',
    borderRadius: '3px', padding: '0.6rem 1rem',
    fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '1.25rem',
  },
  speakingWave: { display: 'flex', alignItems: 'center', gap: '3px', height: '24px' },
  bar: {
    width: '3px', height: '4px', background: 'var(--accent)',
    borderRadius: '2px', animation: 'soundBar 0.5s ease-in-out infinite',
  },
  qCard: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: '4px', padding: '2.5rem', marginBottom: '2rem',
  },
  qNum: {
    fontFamily: 'var(--font-display)', fontSize: '3rem',
    fontWeight: 800, color: 'var(--text3)', marginBottom: '1rem',
  },
  qText: { fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '2rem', color: 'var(--text)' },
  textareaWrapper: {
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: '3px', overflow: 'hidden',
  },
  textarea: {
    width: '100%', background: 'transparent', border: 'none',
    outline: 'none', padding: '1rem 1.25rem',
    color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.7,
    resize: 'vertical', display: 'block',
  },
  textareaFooter: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0.5rem 1rem', borderTop: '1px solid var(--border)',
  },
  micBtn: {
    border: 'none', padding: '0.35rem 0.85rem', fontSize: '0.75rem',
    borderRadius: '2px', transition: 'all 0.2s', letterSpacing: '0.05em', cursor: 'pointer',
  },
  listeningBadge: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    marginTop: '0.75rem', color: 'var(--accent3)', fontSize: '0.8rem',
  },
  pulse: {
    display: 'inline-block', width: '8px', height: '8px',
    borderRadius: '50%', background: 'var(--accent3)', animation: 'pulse 1s infinite',
  },
  navRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navBtn: {
    background: 'transparent', border: '1px solid var(--border)',
    color: 'var(--text2)', padding: '0.75rem 1.5rem',
    fontSize: '0.8rem', letterSpacing: '0.08em', borderRadius: '2px', cursor: 'pointer',
  },
  submitBtn: {
    background: 'var(--accent)', color: '#000', border: 'none',
    padding: '0.75rem 2rem', fontWeight: 700, fontSize: '0.85rem',
    letterSpacing: '0.08em', borderRadius: '2px', cursor: 'pointer',
  },
  evaluatingBanner: {
    marginTop: '2rem', background: 'rgba(0,255,135,0.05)',
    border: '1px solid rgba(0,255,135,0.2)', borderRadius: '4px', padding: '1.25rem',
    display: 'flex', alignItems: 'center', gap: '1rem',
    fontSize: '0.85rem', color: 'var(--accent)',
  },
  spinner: {
    width: '18px', height: '18px',
    border: '2px solid rgba(0,255,135,0.3)', borderTopColor: 'var(--accent)',
    borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0,
  }
}
