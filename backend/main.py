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
from questions import ALL_APTITUDE_QUESTIONS, INTERVIEW_QUESTIONS, FIELDS

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
