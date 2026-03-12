import { useNavigate } from 'react-router-dom'

const FIELDS = [
  { id: 'DataAnalysis', label: 'Data Analysis', desc: 'Pandas, NumPy, EDA, visualization, statistical methods', icon: '📊', color: 'rgba(167,212,245,0.1)', accent: 'var(--accent3)', border: 'rgba(167,212,245,0.3)' },
  { id: 'WebDevelopment', label: 'Web Development', desc: 'HTML, CSS, JavaScript, REST APIs, responsive design', icon: '🌐', color: 'rgba(91,106,191,0.1)', accent: 'var(--accent)', border: 'rgba(91,106,191,0.3)' },
  { id: 'MachineLearning', label: 'Machine Learning', desc: 'Supervised/unsupervised learning, models, evaluation', icon: '🤖', color: 'rgba(124,106,191,0.1)', accent: 'var(--accent2)', border: 'rgba(124,106,191,0.3)' },
  { id: 'CyberSecurity', label: 'Cyber Security', desc: 'Encryption, firewalls, threat analysis, network security', icon: '🔒', color: 'rgba(123,229,192,0.1)', accent: 'var(--success)', border: 'rgba(123,229,192,0.3)' },
]

export default function FieldSelect() {
  const navigate = useNavigate()
  return (
    <main style={s.main} className="page-enter">
      <div style={s.header}>
        <div style={s.tag}>Technical Interview</div>
        <h2 style={s.title}>Choose your field</h2>
        <p style={s.sub}>5 questions per field. Each answer scored 0–10 by AI with detailed feedback.</p>
      </div>
      <div style={s.grid}>
        {FIELDS.map((f, i) => (
          <button key={f.id} style={{ ...s.card, animationDelay: `${i * 0.08}s` }}
            className={`card-hover stagger-${i + 1}`}
            onClick={() => navigate(`/interview/${f.id}`)}
            onMouseEnter={e => { e.currentTarget.style.background = f.color; e.currentTarget.style.borderColor = f.border }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <div style={s.iconWrap}>
              <span style={s.icon}>{f.icon}</span>
            </div>
            <div style={s.fieldName}>{f.label}</div>
            <div style={s.fieldDesc}>{f.desc}</div>
            <div style={{ ...s.startBtn, color: f.accent, borderColor: f.border, background: f.color }}>
              Start Interview →
            </div>
          </button>
        ))}
      </div>
    </main>
  )
}

const s = {
  main: { maxWidth: '960px', margin: '0 auto', padding: '3rem 2rem' },
  header: { marginBottom: '3rem' },
  tag: { display: 'inline-block', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text2)', fontSize: '0.72rem', fontWeight: 600, padding: '0.3rem 0.9rem', borderRadius: '100px', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' },
  title: { fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' },
  sub: { color: 'var(--text2)', fontSize: '0.95rem', lineHeight: 1.6 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.75rem', textAlign: 'left', cursor: 'pointer', display: 'block', transition: 'all 0.25s' },
  iconWrap: { width: '52px', height: '52px', borderRadius: '14px', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', fontSize: '1.5rem' },
  icon: {},
  fieldName: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.5rem' },
  fieldDesc: { color: 'var(--text2)', fontSize: '0.82rem', lineHeight: 1.65, marginBottom: '1.5rem' },
  startBtn: { display: 'inline-block', fontSize: '0.8rem', fontWeight: 600, padding: '0.4rem 0.9rem', borderRadius: '8px', border: '1px solid', transition: 'all 0.2s' },
}
