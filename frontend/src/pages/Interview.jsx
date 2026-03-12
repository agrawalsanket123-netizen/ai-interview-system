import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import BASE_URL from '../api'
import { useAuth } from '../AuthContext'

export default function Interview() {
  const { field } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const recognitionRef = useRef(null)

  const speak = (text) => {
    if (!voiceEnabled) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.9; u.pitch = 1; u.volume = 1
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => v.name.includes('Google') || v.name.includes('David'))
    if (preferred) u.voice = preferred
    u.onstart = () => setSpeaking(true)
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(u)
  }
  const stopSpeaking = () => { window.speechSynthesis.cancel(); setSpeaking(false) }

  useEffect(() => {
    axios.get(`${BASE_URL}/api/interview/questions/${field}`).then(r => {
      setQuestions(r.data.questions); setLoading(false)
    }).catch(() => navigate('/interview'))
  }, [field])

  useEffect(() => {
    if (questions.length > 0 && voiceEnabled) {
      const fieldName = field.replace(/([A-Z])/g, ' $1').trim()
      setTimeout(() => speak(`Welcome to the ${fieldName} interview. Question 1. ${questions[0]}`), 500)
    }
  }, [questions])

  const prevRef = useRef(null)
  useEffect(() => {
    if (questions.length > 0 && voiceEnabled && prevRef.current !== null && prevRef.current !== current) {
      setTimeout(() => speak(`Question ${current + 1}. ${questions[current]}`), 300)
    }
    prevRef.current = current
  }, [current])

  useEffect(() => () => window.speechSynthesis.cancel(), [])

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) { alert('Use Chrome for voice input.'); return }
    stopSpeaking()
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.continuous = false; rec.interimResults = false; rec.lang = 'en-US'
    rec.onstart = () => setListening(true)
    rec.onend = () => setListening(false)
    rec.onresult = (e) => {
      const t = e.results[0][0].transcript
      setAnswers(a => ({ ...a, [current]: (a[current] || '') + ' ' + t }))
    }
    rec.start(); recognitionRef.current = rec
  }
  const stopListening = () => { recognitionRef.current?.stop(); setListening(false) }

  const goTo = (idx) => { stopSpeaking(); prevRef.current = current; setCurrent(idx) }

  const submit = async () => {
    const unanswered = questions.filter((_, i) => !answers[i]?.trim())
    if (unanswered.length) { alert(`${unanswered.length} question(s) unanswered.`); return }
    stopSpeaking(); setSubmitting(true)
    const responses = questions.map((q, i) => ({ question: q, answer: answers[i] || '' }))
    try {
      const res = await axios.post(`${BASE_URL}/api/interview/evaluate`, { field, responses }, { headers: { Authorization: `Bearer ${token}` } })
      navigate('/interview/result', { state: res.data })
    } catch { alert('Evaluation failed. Check backend.'); setSubmitting(false) }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '32px', height: '32px', border: '3px solid var(--border2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>Loading questions...</div>
    </div>
  )

  const q = questions[current]
  const allAnswered = questions.every((_, i) => answers[i]?.trim())

  return (
    <main style={s.main} className="page-enter">
      <div style={s.topBar}>
        <div style={{ ...s.topFill, width: `${((Object.keys(answers).length) / questions.length) * 100}%` }} />
      </div>

      <div style={s.header}>
        <div>
          <div style={s.fieldTag}>{field.replace(/([A-Z])/g, ' $1').trim()} Interview</div>
          <div style={s.counter}>Question {current + 1} / {questions.length}</div>
        </div>
        <div style={s.controls}>
          <button style={{ ...s.voiceBtn, borderColor: voiceEnabled ? 'var(--accent)' : 'var(--border)', color: voiceEnabled ? 'var(--accent)' : 'var(--text3)', background: voiceEnabled ? 'rgba(91,106,191,0.08)' : 'transparent' }}
            onClick={() => { if (voiceEnabled) stopSpeaking(); setVoiceEnabled(v => !v) }}>
            {voiceEnabled ? '🔊' : '🔇'}
          </button>
          {voiceEnabled && (
            <button style={{ ...s.replayBtn, color: speaking ? 'var(--danger)' : 'var(--text2)' }}
              onClick={() => speaking ? stopSpeaking() : speak(`Question ${current + 1}. ${q}`)}>
              {speaking ? '⏹' : '▶'}
            </button>
          )}
          <div style={s.dots}>
            {questions.map((_, i) => (
              <div key={i} onClick={() => goTo(i)} style={{
                ...s.dot, cursor: 'pointer',
                background: answers[i] ? 'var(--accent)' : i === current ? 'var(--accent2)' : 'var(--surface3)',
                boxShadow: i === current ? '0 0 8px var(--accent-glow)' : 'none',
              }} />
            ))}
          </div>
        </div>
      </div>

      {speaking && (
        <div style={s.speakBanner}>
          <div style={s.wave}>{[...Array(5)].map((_, i) => <div key={i} style={{ ...s.waveBar, animationDelay: `${i * 0.1}s` }} />)}</div>
          Reading question aloud...
        </div>
      )}

      <div style={s.qCard} className="stagger-1">
        <div style={s.qNum}>Q{current + 1}</div>
        <div style={s.qText}>{q}</div>
        <div style={s.textareaWrap}>
          <textarea style={s.textarea} rows={5} placeholder="Type your answer here, or use voice input..."
            value={answers[current] || ''} onChange={e => setAnswers(a => ({ ...a, [current]: e.target.value }))} />
          <div style={s.taFooter}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{(answers[current] || '').length} chars</span>
            <button style={{ ...s.micBtn, background: listening ? 'var(--danger)' : 'var(--surface3)', color: listening ? '#fff' : 'var(--text2)' }}
              onClick={listening ? stopListening : startListening}>
              {listening ? '⏹ Stop' : '🎤 Voice'}
            </button>
          </div>
        </div>
        {listening && (
          <div style={s.listeningBadge}>
            <span style={s.pulse} /> Listening...
          </div>
        )}
      </div>

      <div style={s.navRow}>
        <button style={{ ...s.navBtn, opacity: current === 0 ? 0.3 : 1 }} onClick={() => goTo(Math.max(0, current - 1))} disabled={current === 0}>← Prev</button>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {current < questions.length - 1 && <button style={s.navBtn} onClick={() => goTo(current + 1)}>Next →</button>}
          {allAnswered && <button style={{ ...s.submitBtn, opacity: submitting ? 0.7 : 1 }} className="btn-glow" onClick={submit} disabled={submitting}>{submitting ? 'Evaluating...' : 'Submit →'}</button>}
        </div>
      </div>

      {submitting && (
        <div style={s.evalBanner}>
          <div style={s.spinner} />
          AI is evaluating your answers...
        </div>
      )}

      <style>{`
        @keyframes soundBar { 0%,100%{height:4px} 50%{height:20px} }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </main>
  )
}

const s = {
  main: { maxWidth: '800px', margin: '0 auto', padding: '0 2rem 4rem' },
  topBar: { height: '3px', background: 'var(--surface2)', marginBottom: '2.5rem', borderRadius: '2px', overflow: 'hidden' },
  topFill: { height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--accent2))', borderRadius: '2px', transition: 'width 0.4s ease' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  fieldTag: { fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: '0.3rem' },
  counter: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text2)' },
  controls: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  voiceBtn: { border: '1px solid', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '1rem', transition: 'all 0.2s', cursor: 'pointer', background: 'transparent' },
  replayBtn: { border: '1px solid var(--border)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', transition: 'all 0.2s', cursor: 'pointer', background: 'transparent' },
  dots: { display: 'flex', gap: '0.35rem' },
  dot: { width: '28px', height: '5px', borderRadius: '3px', transition: 'all 0.3s' },
  speakBanner: { display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(91,106,191,0.06)', border: '1px solid rgba(91,106,191,0.2)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 1rem', fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '1.25rem' },
  wave: { display: 'flex', alignItems: 'center', gap: '3px', height: '24px' },
  waveBar: { width: '3px', height: '4px', background: 'var(--accent)', borderRadius: '2px', animation: 'soundBar 0.5s ease-in-out infinite' },
  qCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2.5rem', marginBottom: '2rem' },
  qNum: { fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--surface3)', marginBottom: '1rem', lineHeight: 1 },
  qText: { fontSize: '1.1rem', lineHeight: 1.65, marginBottom: '2rem', color: 'var(--text)', fontWeight: 500 },
  textareaWrap: { background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', transition: 'border-color 0.2s' },
  textarea: { width: '100%', background: 'transparent', border: 'none', outline: 'none', padding: '1rem 1.25rem', color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.7, resize: 'vertical', display: 'block' },
  taFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem', borderTop: '1px solid var(--border)' },
  micBtn: { border: 'none', padding: '0.3rem 0.85rem', fontSize: '0.78rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' },
  listeningBadge: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', color: 'var(--danger)', fontSize: '0.82rem' },
  pulse: { display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)', animation: 'pulse-dot 1s infinite' },
  navRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navBtn: { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '0.75rem 1.5rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.2s' },
  submitBtn: { background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff', border: 'none', padding: '0.75rem 2rem', fontWeight: 700, fontSize: '0.9rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' },
  evalBanner: { marginTop: '2rem', background: 'rgba(91,106,191,0.06)', border: '1px solid rgba(91,106,191,0.2)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: 'var(--accent)' },
  spinner: { width: '18px', height: '18px', border: '2px solid rgba(91,106,191,0.3)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 },
}
