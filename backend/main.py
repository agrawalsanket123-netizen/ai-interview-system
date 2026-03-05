import socket
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import csv
import json
import os
from datetime import datetime
from difflib import SequenceMatcher
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="AI Interview System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- GROQ CLIENT ----------
client = Groq(api_key=os.environ.get("GROQ_API_KEY", ""))

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
    print(f"\n  Open Mobile URL on any device on same WiFi!")
    print("="*50 + "\n")

# ---------- MODELS ----------
class AptitudeAnswerRequest(BaseModel):
    answers: List[str]  # List of chosen options e.g. ["C", "A", "C", ...]

class InterviewAnswerRequest(BaseModel):
    field: str
    responses: List[dict]  # [{"question": "...", "answer": "..."}]

class EvaluateRequest(BaseModel):
    field: str
    question: str
    answer: str

# ---------- DATA ----------
import random

ALL_APTITUDE_QUESTIONS = [
    # Number Series
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
    # Arithmetic
    {"question": "If 5 machines take 5 minutes to make 5 products, how long will 100 machines take to make 100 products?", "options": {"A": "5 minutes", "B": "10 minutes", "C": "100 minutes", "D": "1 minute"}, "answer": "A"},
    {"question": "A train travels 60 km in 1 hour. How far will it travel in 30 minutes?", "options": {"A": "15 km", "B": "20 km", "C": "30 km", "D": "60 km"}, "answer": "C"},
    {"question": "If 6 workers can build a wall in 10 days, how many days will 3 workers take?", "options": {"A": "5", "B": "15", "C": "20", "D": "12"}, "answer": "C"},
    {"question": "A shopkeeper sells an item for Rs.120 at a 20% profit. What is the cost price?", "options": {"A": "Rs.90", "B": "Rs.96", "C": "Rs.100", "D": "Rs.110"}, "answer": "C"},
    {"question": "What is 15% of 200?", "options": {"A": "20", "B": "25", "C": "30", "D": "35"}, "answer": "C"},
    {"question": "If a car covers 180 km in 3 hours, what is its speed in km/h?", "options": {"A": "40", "B": "50", "C": "60", "D": "70"}, "answer": "C"},
    {"question": "A is twice as old as B. If B is 15, how old is A?", "options": {"A": "25", "B": "28", "C": "30", "D": "32"}, "answer": "C"},
    {"question": "If 3x + 6 = 18, what is x?", "options": {"A": "2", "B": "3", "C": "4", "D": "6"}, "answer": "C"},
    {"question": "What is the simple interest on Rs.1000 at 5% per year for 2 years?", "options": {"A": "Rs.50", "B": "Rs.75", "C": "Rs.100", "D": "Rs.150"}, "answer": "C"},
    {"question": "A pipe fills a tank in 4 hours. Another empties it in 8 hours. How long to fill when both are open?", "options": {"A": "4 hrs", "B": "6 hrs", "C": "8 hrs", "D": "12 hrs"}, "answer": "C"},
    # Logical / Alphabet
    {"question": "If A = 1, B = 2, C = 3, what is the value of D + E?", "options": {"A": "7", "B": "8", "C": "9", "D": "10"}, "answer": "C"},
    {"question": "Which letter comes next: A, C, E, G, ?", "options": {"A": "H", "B": "I", "C": "J", "D": "K"}, "answer": "B"},
    {"question": "ABCD is to DCBA as MNOP is to ?", "options": {"A": "PONM", "B": "OPMN", "C": "NOPQ", "D": "PNOM"}, "answer": "A"},
    {"question": "Which letter is 3rd to the right of the 7th letter from the left in the alphabet?", "options": {"A": "I", "B": "J", "C": "K", "D": "L"}, "answer": "B"},
    # Reasoning
    {"question": "All roses are flowers. All flowers fade. Therefore:", "options": {"A": "All flowers are roses", "B": "Some roses fade", "C": "All roses fade", "D": "None of the above"}, "answer": "C"},
    {"question": "Which one is different: Apple, Mango, Banana, Carrot?", "options": {"A": "Apple", "B": "Mango", "C": "Banana", "D": "Carrot"}, "answer": "D"},
    {"question": "Book is to Reading as Fork is to ?", "options": {"A": "Kitchen", "B": "Eating", "C": "Cooking", "D": "Food"}, "answer": "B"},
    {"question": "Pointing to a man, a woman says 'His mother is the only daughter of my mother.' How is the woman related to the man?", "options": {"A": "Grandmother", "B": "Sister", "C": "Mother", "D": "Aunt"}, "answer": "C"},
    {"question": "If CLOUD is coded as DNPVF, how is RAIN coded?", "options": {"A": "SBJO", "B": "TCJP", "C": "SDLQ", "D": "SAJO"}, "answer": "A"},
    {"question": "Find the odd one out: 121, 144, 169, 196, 200", "options": {"A": "121", "B": "169", "C": "200", "D": "196"}, "answer": "C"},
    # Data / Math
    {"question": "If the average of 5 numbers is 20, what is their sum?", "options": {"A": "80", "B": "90", "C": "100", "D": "110"}, "answer": "C"},
    {"question": "A bag has 3 red, 4 blue and 5 green balls. What is the probability of picking a red ball?", "options": {"A": "1/4", "B": "1/3", "C": "1/2", "D": "1/6"}, "answer": "A"},
    {"question": "The average of 10, 20, 30 and x is 25. What is x?", "options": {"A": "30", "B": "35", "C": "40", "D": "45"}, "answer": "C"},
    {"question": "If 40% of a number is 80, what is the number?", "options": {"A": "150", "B": "175", "C": "200", "D": "225"}, "answer": "C"},
    {"question": "What is the LCM of 4 and 6?", "options": {"A": "8", "B": "10", "C": "12", "D": "24"}, "answer": "C"},
    {"question": "What is the HCF of 12 and 18?", "options": {"A": "3", "B": "6", "C": "9", "D": "12"}, "answer": "B"},
    # Tech / General
    {"question": "Which data structure uses LIFO order?", "options": {"A": "Queue", "B": "Stack", "C": "Array", "D": "Tree"}, "answer": "B"},
    {"question": "What does CPU stand for?", "options": {"A": "Central Process Unit", "B": "Control Processing Unit", "C": "Central Processing Unit", "D": "Core Processing Unit"}, "answer": "C"},
    {"question": "Which of these is NOT a programming language?", "options": {"A": "Python", "B": "Java", "C": "HTML", "D": "Cobra"}, "answer": "C"},
    {"question": "What does RAM stand for?", "options": {"A": "Random Access Memory", "B": "Read Access Memory", "C": "Rapid Access Module", "D": "Random Allocation Memory"}, "answer": "A"},
    {"question": "Which symbol is used for comments in Python?", "options": {"A": "//", "B": "/*", "C": "#", "D": "--"}, "answer": "C"},
]

APTITUDE_QUESTIONS = random.sample(ALL_APTITUDE_QUESTIONS, 10)

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

# ---------- CSV HELPERS ----------
def save_aptitude_result(score, total):
    os.makedirs("data", exist_ok=True)
    with open("data/aptitude_results.csv", "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([datetime.now().strftime("%Y-%m-%d %H:%M:%S"), score, total])

def save_interview_responses(field, results):
    os.makedirs("data", exist_ok=True)
    with open("data/interview_responses.csv", "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        for r in results:
            writer.writerow([
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                field,
                r.get("question", ""),
                r.get("answer", ""),
                r.get("score", 0),
                r.get("feedback", "")
            ])

# ---------- CLAUDE EVALUATION ----------
def evaluate_with_claude(field: str, responses: list):
    prompt = f"""You are a technical interviewer for a {field} position.
Evaluate each candidate answer below. For each, provide:
- score: integer from 0 to 10
- feedback: one concise sentence of feedback

Respond ONLY with a valid JSON array, no extra text:
[{{"question": "...", "answer": "...", "score": 8, "feedback": "..."}}, ...]

Responses to evaluate:
"""
    for r in responses:
        prompt += f"\nQuestion: {r['question']}\nAnswer: {r['answer']}\n"

    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0,
            max_tokens=1000,
        )
        text = chat_completion.choices[0].message.content.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text.strip())
    except Exception as e:
        print(f"Claude evaluation error: {e}")
        # Fallback to similarity scoring
        results = []
        for r in responses:
            score = round(SequenceMatcher(None, r["answer"].lower(), r["question"].lower()).ratio() * 10, 1)
            results.append({
                "question": r["question"],
                "answer": r["answer"],
                "score": score,
                "feedback": "Evaluated using similarity scoring (Claude unavailable)."
            })
        return results

# ---------- ROUTES ----------

@app.get("/")
def root():
    return {"message": "AI Interview System API is running"}

@app.get("/api/fields")
def get_fields():
    return {"fields": FIELDS}

@app.get("/api/aptitude/questions")
def get_aptitude_questions():
    # Don't send answers to frontend
    questions = []
    for i, q in enumerate(APTITUDE_QUESTIONS):
        questions.append({
            "id": i,
            "question": q["question"],
            "options": q["options"]
        })
    return {"questions": questions}

@app.post("/api/aptitude/submit")
def submit_aptitude(req: AptitudeAnswerRequest):
    if len(req.answers) != len(APTITUDE_QUESTIONS):
        raise HTTPException(status_code=400, detail="Answer count mismatch")
    
    score = 0
    results = []
    for i, (ans, q) in enumerate(zip(req.answers, APTITUDE_QUESTIONS)):
        correct = ans.upper() == q["answer"]
        if correct:
            score += 1
        results.append({
            "question": q["question"],
            "your_answer": ans.upper(),
            "correct_answer": q["answer"],
            "correct": correct
        })

    save_aptitude_result(score, len(APTITUDE_QUESTIONS))
    return {"score": score, "total": len(APTITUDE_QUESTIONS), "results": results}

@app.get("/api/interview/questions/{field}")
def get_interview_questions(field: str):
    if field not in INTERVIEW_QUESTIONS:
        raise HTTPException(status_code=404, detail="Field not found")
    return {"field": field, "questions": INTERVIEW_QUESTIONS[field]}

@app.post("/api/interview/evaluate")
def evaluate_interview(req: InterviewAnswerRequest):
    if req.field not in INTERVIEW_QUESTIONS:
        raise HTTPException(status_code=404, detail="Field not found")
    
    results = evaluate_with_claude(req.field, req.responses)
    save_interview_responses(req.field, results)

    total_score = sum(r.get("score", 0) for r in results)
    overall = round(total_score / len(results), 1) if results else 0

    return {
        "field": req.field,
        "results": results,
        "overall_score": overall,
        "total_questions": len(results)
    }

@app.get("/api/results/aptitude")
def get_aptitude_results():
    rows = []
    try:
        with open("data/aptitude_results.csv", "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            for row in reader:
                if len(row) == 3:
                    rows.append({"timestamp": row[0], "score": row[1], "total": row[2]})
    except FileNotFoundError:
        pass
    return {"results": rows}

@app.get("/api/results/interview")
def get_interview_results():
    rows = []
    try:
        with open("data/interview_responses.csv", "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            for row in reader:
                if len(row) == 6:
                    rows.append({
                        "timestamp": row[0], "field": row[1],
                        "question": row[2], "answer": row[3],
                        "score": row[4], "feedback": row[5]
                    })
    except FileNotFoundError:
        pass
    return {"results": rows}
