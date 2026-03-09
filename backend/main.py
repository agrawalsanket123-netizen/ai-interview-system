import socket
import json
import os
import jwt
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from difflib import SequenceMatcher
from groq import Groq
from supabase import create_client, Client
from dotenv import load_dotenv
import random

load_dotenv()

# ---------- CLIENTS ----------
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY", ""))
supabase: Client = create_client(
    os.environ.get("SUPABASE_URL", ""),
    os.environ.get("SUPABASE_SERVICE_KEY", "")
)

app = FastAPI(title="AI Interview System API")
security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- STARTUP ----------
def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

@app.on_event("startup")
async def startup():
    ip = get_local_ip()
    print("\n" + "="*50)
    print("   AI INTERVIEW SYSTEM - RUNNING!")
    print("="*50)
    print(f"  Backend API  : http://localhost:8000")
    print(f"  Frontend     : http://localhost:5173")
    print(f"\n  📱 Mobile URL : http://{ip}:5173")
    print("="*50 + "\n")

# ---------- MODELS ----------
class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str

class LoginRequest(BaseModel):
    email: str
    password: str

class AptitudeAnswerRequest(BaseModel):
    answers: List[str]

class InterviewAnswerRequest(BaseModel):
    field: str
    responses: List[dict]

# ---------- AUTH HELPER ----------
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        # Verify token with Supabase
        user = supabase.auth.get_user(token)
        if not user or not user.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user.user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ---------- DATA ----------
ALL_APTITUDE_QUESTIONS = [
    {"question": "What is the next number in the series: 2, 4, 8, 16, ?", "options": {"A": "18", "B": "24", "C": "32", "D": "64"}, "answer": "C"},
    {"question": "Which number is missing: 1, 4, 9, 16, ?", "options": {"A": "20", "B": "24", "C": "25", "D": "36"}, "answer": "C"},
    {"question": "What is the next number: 3, 6, 12, 24, ?", "options": {"A": "36", "B": "48", "C": "42", "D": "30"}, "answer": "B"},
    {"question": "Find the missing number: 5, 10, 20, 40, ?", "options": {"A": "60", "B": "70", "C": "80", "D": "50"}, "answer": "C"},
    {"question": "What comes next: 1, 3, 6, 10, 15, ?", "options": {"A": "18", "B": "21", "C": "20", "D": "19"}, "answer": "B"},
    {"question": "Next in series: 2, 5, 10, 17, 26, ?", "options": {"A": "35", "B": "36", "C": "37", "D": "38"}, "answer": "C"},
    {"question": "Find the next: 100, 50, 25, 12.5, ?", "options": {"A": "5", "B": "6", "C": "6.25", "D": "7"}, "answer": "C"},
    {"question": "What is the next: 1, 1, 2, 3, 5, 8, ?", "options": {"A": "11", "B": "12", "C": "13", "D": "14"}, "answer": "C"},
    {"question": "Next number: 7, 14, 21, 28, ?", "options": {"A": "32", "B": "35", "C": "36", "D": "42"}, "answer": "B"},
    {"question": "What is the next: 2, 6, 18, 54, ?", "options": {"A": "108", "B": "162", "C": "216", "D": "270"}, "answer": "B"},
    {"question": "If 5 machines take 5 minutes to make 5 products, how long will 100 machines take to make 100 products?", "options": {"A": "5 minutes", "B": "10 minutes", "C": "100 minutes", "D": "1 minute"}, "answer": "A"},
    {"question": "A train travels 60 km in 1 hour. How far will it travel in 30 minutes?", "options": {"A": "15 km", "B": "20 km", "C": "30 km", "D": "60 km"}, "answer": "C"},
    {"question": "If 6 workers can build a wall in 10 days, how many days will 3 workers take?", "options": {"A": "5", "B": "15", "C": "20", "D": "12"}, "answer": "C"},
    {"question": "What is 15% of 200?", "options": {"A": "20", "B": "25", "C": "30", "D": "35"}, "answer": "C"},
    {"question": "If a car covers 180 km in 3 hours, what is its speed in km/h?", "options": {"A": "40", "B": "50", "C": "60", "D": "70"}, "answer": "C"},
    {"question": "If 3x + 6 = 18, what is x?", "options": {"A": "2", "B": "3", "C": "4", "D": "6"}, "answer": "C"},
    {"question": "If A = 1, B = 2, C = 3, what is the value of D + E?", "options": {"A": "7", "B": "8", "C": "9", "D": "10"}, "answer": "C"},
    {"question": "Which letter comes next: A, C, E, G, ?", "options": {"A": "H", "B": "I", "C": "J", "D": "K"}, "answer": "B"},
    {"question": "All roses are flowers. All flowers fade. Therefore:", "options": {"A": "All flowers are roses", "B": "Some roses fade", "C": "All roses fade", "D": "None of the above"}, "answer": "C"},
    {"question": "Which one is different: Apple, Mango, Banana, Carrot?", "options": {"A": "Apple", "B": "Mango", "C": "Banana", "D": "Carrot"}, "answer": "D"},
    {"question": "Book is to Reading as Fork is to ?", "options": {"A": "Kitchen", "B": "Eating", "C": "Cooking", "D": "Food"}, "answer": "B"},
    {"question": "If the average of 5 numbers is 20, what is their sum?", "options": {"A": "80", "B": "90", "C": "100", "D": "110"}, "answer": "C"},
    {"question": "If 40% of a number is 80, what is the number?", "options": {"A": "150", "B": "175", "C": "200", "D": "225"}, "answer": "C"},
    {"question": "What is the LCM of 4 and 6?", "options": {"A": "8", "B": "10", "C": "12", "D": "24"}, "answer": "C"},
    {"question": "Which data structure uses LIFO order?", "options": {"A": "Queue", "B": "Stack", "C": "Array", "D": "Tree"}, "answer": "B"},
    {"question": "What does CPU stand for?", "options": {"A": "Central Process Unit", "B": "Control Processing Unit", "C": "Central Processing Unit", "D": "Core Processing Unit"}, "answer": "C"},
    {"question": "Which symbol is used for comments in Python?", "options": {"A": "//", "B": "/*", "C": "#", "D": "--"}, "answer": "C"},
    {"question": "What does RAM stand for?", "options": {"A": "Random Access Memory", "B": "Read Access Memory", "C": "Rapid Access Module", "D": "Random Allocation Memory"}, "answer": "A"},
    {"question": "Find the odd one out: 121, 144, 169, 196, 200", "options": {"A": "121", "B": "169", "C": "200", "D": "196"}, "answer": "C"},
    {"question": "What is the HCF of 12 and 18?", "options": {"A": "3", "B": "6", "C": "9", "D": "12"}, "answer": "B"},
]

INTERVIEW_QUESTIONS = {
    "DataAnalysis": [
        "How do you handle missing or inconsistent data during data analysis?",
        "What is normalization and why is it important?",
        "Explain exploratory data analysis (EDA).",
        "Which tools or libraries do you use for data visualization?",
        "How do you deal with outliers in a dataset?"
    ],
    "WebDevelopment": [
        "What is HTML and what is its role in web development?",
        "What is CSS and how do you use it to style web pages?",
        "Explain the difference between GET and POST methods.",
        "What is responsive web design?",
        "Can you explain the concept of DOM in JavaScript?"
    ],
    "MachineLearning": [
        "What is supervised learning and unsupervised learning?",
        "Explain the difference between classification and regression.",
        "What is overfitting and how can you prevent it?",
        "What is the purpose of cross-validation in ML?",
        "Can you explain a machine learning project you have done?"
    ],
    "CyberSecurity": [
        "What is the difference between encryption and hashing?",
        "What are the common types of cyber attacks?",
        "Explain what a firewall does.",
        "What is social engineering in cybersecurity?",
        "How do you secure a network from unauthorized access?"
    ]
}

FIELDS = list(INTERVIEW_QUESTIONS.keys())

# ---------- GROQ EVALUATION ----------
def evaluate_with_groq(field, responses):
    prompt = f"You are a technical interviewer for {field}. Evaluate each answer. Respond ONLY as a JSON array: [{{\"question\":\"...\",\"answer\":\"...\",\"score\":8,\"feedback\":\"...\"}}]\n\n"
    for r in responses:
        prompt += f"Question: {r['question']}\nAnswer: {r['answer']}\n\n"
    try:
        res = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0,
            max_tokens=1000,
        )
        text = res.choices[0].message.content.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text.strip())
    except Exception as e:
        print(f"Groq error: {e}")
        return [{"question": r["question"], "answer": r["answer"], "score": round(SequenceMatcher(None, r["answer"].lower(), r["question"].lower()).ratio()*10, 1), "feedback": "Similarity scoring used."} for r in responses]

# ---------- AUTH ROUTES ----------
@app.post("/api/auth/register")
def register(req: RegisterRequest):
    try:
        res = supabase.auth.sign_up({
            "email": req.email,
            "password": req.password,
            "options": {"data": {"full_name": req.full_name}}
        })
        if res.user:
            return {"message": "Registration successful! Please check your email to verify your account."}
        raise HTTPException(status_code=400, detail="Registration failed")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/login")
def login(req: LoginRequest):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": req.email,
            "password": req.password
        })
        if res.user and res.session:
            return {
                "access_token": res.session.access_token,
                "user": {
                    "id": res.user.id,
                    "email": res.user.email,
                    "full_name": res.user.user_metadata.get("full_name", "")
                }
            }
        raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid email or password")

@app.post("/api/auth/logout")
def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except:
        return {"message": "Logged out"}

@app.get("/api/auth/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.user_metadata.get("full_name", "")
    }

# ---------- GENERAL ROUTES ----------
@app.get("/")
def root():
    return {"message": "AI Interview System API is running"}

@app.get("/api/fields")
def get_fields():
    return {"fields": FIELDS}

# ---------- APTITUDE ROUTES ----------
@app.get("/api/aptitude/questions")
def get_aptitude_questions():
    questions = random.sample(ALL_APTITUDE_QUESTIONS, 10)
    return {"questions": [{"id": i, "question": q["question"], "options": q["options"]} for i, q in enumerate(questions)], "session_questions": questions}

@app.post("/api/aptitude/submit")
def submit_aptitude(req: AptitudeAnswerRequest, current_user=Depends(get_current_user)):
    # Re-fetch questions based on answers length
    questions = random.sample(ALL_APTITUDE_QUESTIONS, len(req.answers))
    score = 0
    results = []
    for ans, q in zip(req.answers, questions):
        correct = ans.upper() == q["answer"]
        if correct:
            score += 1
        results.append({
            "question": q["question"],
            "your_answer": ans.upper(),
            "correct_answer": q["answer"],
            "correct": correct
        })

    # Save to Supabase
    try:
        supabase.table("aptitude_results").insert({
            "user_id": current_user.id,
            "score": score,
            "total": len(questions),
            "results": results
        }).execute()
    except Exception as e:
        print(f"DB save error: {e}")

    return {"score": score, "total": len(questions), "results": results}

@app.get("/api/interview/questions/{field}")
def get_interview_questions(field: str):
    if field not in INTERVIEW_QUESTIONS:
        raise HTTPException(status_code=404, detail="Field not found")
    return {"field": field, "questions": INTERVIEW_QUESTIONS[field]}

@app.post("/api/interview/evaluate")
def evaluate_interview(req: InterviewAnswerRequest, current_user=Depends(get_current_user)):
    if req.field not in INTERVIEW_QUESTIONS:
        raise HTTPException(status_code=404, detail="Field not found")

    results = evaluate_with_groq(req.field, req.responses)
    total_score = sum(r.get("score", 0) for r in results)
    overall = round(total_score / len(results), 1) if results else 0

    # Save to Supabase
    try:
        supabase.table("interview_results").insert({
            "user_id": current_user.id,
            "field": req.field,
            "responses": results,
            "overall_score": overall
        }).execute()
    except Exception as e:
        print(f"DB save error: {e}")

    return {"field": req.field, "results": results, "overall_score": overall, "total_questions": len(results)}

# ---------- RESULTS ROUTES ----------
@app.get("/api/results/aptitude")
def get_aptitude_results(current_user=Depends(get_current_user)):
    try:
        res = supabase.table("aptitude_results").select("*").eq("user_id", current_user.id).order("created_at", desc=True).execute()
        return {"results": res.data}
    except Exception as e:
        return {"results": []}

@app.get("/api/results/interview")
def get_interview_results(current_user=Depends(get_current_user)):
    try:
        res = supabase.table("interview_results").select("*").eq("user_id", current_user.id).order("created_at", desc=True).execute()
        return {"results": res.data}
    except Exception as e:
        return {"results": []}
