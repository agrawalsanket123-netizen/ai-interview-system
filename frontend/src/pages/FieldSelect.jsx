import { useNavigate } from 'react-router-dom'

const FIELDS = [
  {
    id: 'DataAnalysis',
    label: 'Data Analysis',
    desc: 'Pandas, NumPy, EDA, visualization, statistical methods',
    icon: '📊',
    color: '#00c4ff',
  },
  {
    id: 'WebDevelopment',
    label: 'Web Development',
    desc: 'HTML, CSS, JavaScript, REST APIs, responsive design',
    icon: '🌐',
    color: '#00ff87',
  },
  {
    id: 'MachineLearning',
    label: 'Machine Learning',
    desc: 'Supervised/unsupervised learning, models, evaluation',
    icon: '🤖',
    color: '#ff6b6b',
  },
  {
    id: 'CyberSecurity',
    label: 'Cyber Security',
    desc: 'Encryption, firewalls, threat analysis, network security',
    icon: '🔒',
    color: '#ffd166',
  },
]

export default function FieldSelect() {
  const navigate = useNavigate()

  return (
    <main style={styles.main}>
      <div style={styles.label}>Technical Interview</div>
      <h2 style={styles.h2}>Select Your Field</h2>
      <p style={styles.sub}>You'll be asked 5 questions. Claude AI will score your answers from 0–10.</p>

      <div style={styles.grid}>
        {FIELDS.map(f => (
          <button
            key={f.id}
            style={styles.card}
            onClick={() => navigate(`/interview/${f.id}`)}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = f.color
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <div style={styles.icon}>{f.icon}</div>
            <div style={{ ...styles.fieldLabel, color: f.color }}>{f.label}</div>
            <div style={styles.fieldDesc}>{f.desc}</div>
            <div style={{ ...styles.arrow, color: f.color }}>→</div>
          </button>
        ))}
      </div>
    </main>
  )
}

const styles = {
  main: { maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' },
  label: { fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '1rem' },
  h2: { fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' },
  sub: { color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '3rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '2rem',
    textAlign: 'left',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
    position: 'relative',
  },
  icon: { fontSize: '2rem', marginBottom: '1rem' },
  fieldLabel: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.6rem' },
  fieldDesc: { color: 'var(--text2)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '1.5rem' },
  arrow: { fontSize: '1.25rem', fontWeight: 700 },
}
