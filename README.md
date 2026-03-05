# 🤖 AI Interview System

A full-stack automated interview system powered by **Claude AI**. Features aptitude testing and technical interviews with real-time AI scoring and feedback.

---

## 📁 Project Structure

```
ai-interview-system/
├── backend/
│   ├── main.py              # FastAPI backend (all API routes)
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variables template
│   └── data/                # CSV results (auto-created)
├── frontend/
│   ├── src/
│   │   ├── pages/           # Home, AptitudeTest, Interview, Dashboard, etc.
│   │   ├── components/      # Navbar
│   │   ├── App.jsx          # Routing
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── ai-interview.code-workspace
```

---

## ⚙️ Setup Instructions

### Step 1 — Get your Anthropic API Key
1. Go to https://console.anthropic.com
2. Create an account and generate an API key
3. Keep it handy for Step 3

---

### Step 2 — Backend Setup

Open a terminal in VS Code and run:

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

### Step 3 — Configure API Key

```bash
# In the backend folder, copy the example env file
cp .env.example .env
```

Open `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

> ⚠️ NEVER commit your `.env` file to Git. It's already in `.gitignore`.

---

### Step 4 — Frontend Setup

Open a **second terminal** in VS Code:

```bash
cd frontend
npm install
```

---

## 🚀 Running the App

You need **two terminals** running simultaneously:

### Terminal 1 — Backend
```bash
cd backend
venv\Scripts\activate   # Windows
# OR: source venv/bin/activate (Mac/Linux)

uvicorn main:app --reload --port 8000
```

✅ Backend runs at: http://localhost:8000
📖 API Docs at: http://localhost:8000/docs

---

### Terminal 2 — Frontend
```bash
cd frontend
npm run dev
```

✅ Frontend runs at: http://localhost:5173

---

## 🎯 Features

| Feature | Description |
|---|---|
| Aptitude Test | 5 MCQ questions with instant scoring |
| Field Selection | Choose from 4 technical fields |
| Technical Interview | 5 questions per field, typed or voice answers |
| AI Evaluation | Claude AI scores each answer 0–10 with feedback |
| Voice Input | Browser speech recognition for hands-free answering |
| Dashboard | View all past aptitude and interview results |
| CSV Storage | All results saved to `backend/data/` |

---

## 🧠 Interview Fields

- **Data Analysis** — Pandas, NumPy, EDA, visualization
- **Web Development** — HTML, CSS, JS, REST APIs
- **Machine Learning** — Supervised/unsupervised, overfitting, CV
- **Cyber Security** — Encryption, firewalls, social engineering

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router |
| Backend | FastAPI, Python 3.10+ |
| AI Scoring | Anthropic Claude (claude-sonnet) |
| Data Storage | CSV files |
| Styling | Pure CSS with CSS variables |

---

## 🔧 Troubleshooting

**Backend won't start?**
- Make sure venv is activated
- Make sure `.env` has your API key
- Try: `pip install -r requirements.txt` again

**Frontend can't connect to backend?**
- Make sure backend is running on port 8000
- The Vite proxy forwards `/api` calls automatically

**Voice input not working?**
- Use Google Chrome (best support for Web Speech API)
- Allow microphone permissions when prompted

**Claude API errors?**
- Check your API key in `.env`
- Verify you have API credits at console.anthropic.com
