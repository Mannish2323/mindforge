from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random

app = FastAPI(title="EVLO AI Tutor Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GrammarExplainRequest(BaseModel):
    grammar_id: str
    structure: str
    title: str
    explanation_en: str
    explanation_hi: Optional[str] = None
    lang: str = "en"

class SpeechCheckRequest(BaseModel):
    japanese_text: str
    romaji: str
    speech_base64: str  # Simulated audio payload

class RecommendRequest(BaseModel):
    userId: str
    srs_card_ids: List[str]
    completed_lessons: List[str]

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "python-ai"}

@app.post("/api/ai/explain")
def explain_grammar(req: GrammarExplainRequest):
    # Dynamic tutor response generation based on the grammar point
    structure_formatted = f"`{req.structure}`"
    
    explanation_en = (
        f"The structure {structure_formatted} (meaning '{req.title}') is a key Japanese grammatical form. "
        f"In English: {req.explanation_en}. "
        f"💡 **Tutor Tip**: Try forming a sentence like: '{req.structure} + noun' or using it at the end of sentences for polite speech. "
        "Pronounce it with a light accent on the particle!"
    )
    
    explanation_hi = (
        f"यह व्याकरण {structure_formatted} (अर्थात '{req.title}') जापानी भाषा का एक महत्वपूर्ण नियम है। "
        f"इसका मतलब है: {req.explanation_hi or req.explanation_en}। "
        f"💡 **ट्यूटर की सलाह**: इस फॉर्मूले का उपयोग वाक्य के अंत में विनम्रता से बात करने के लिए करें।"
    )
    
    return {
        "grammar_id": req.grammar_id,
        "explanation": explanation_hi if req.lang == "hi" else explanation_en,
        "language_used": req.lang,
        "tokens_processed": 142
    }

@app.post("/api/ai/speech")
def check_speech(req: SpeechCheckRequest):
    if not req.speech_base64:
        raise HTTPException(status_code=400, detail="Speech data is missing")
    
    # Calculate a mock score based on text length and some random variance
    score = random.randint(85, 100)
    feedback = "Excellent pronunciation! Your pitch accent is spot-on."
    if score < 90:
        feedback = f"Good attempt! Pay slightly more attention to the double consonants in '{req.japanese_text}'."
        
    return {
        "text": req.japanese_text,
        "romaji": req.romaji,
        "pronunciation_score": score,
        "feedback": feedback,
        "accuracy_breakdown": {
            "pitch_accent": round(random.uniform(8.5, 10.0), 1),
            "fluency": round(random.uniform(8.0, 10.0), 1),
            "completeness": 10.0
        }
    }

@app.post("/api/ai/recommend-next")
def recommend_next(req: RecommendRequest):
    # Returns recommended lessons based on current state
    mock_suggestions = [
        {"lesson_id": "ja_u01_l01_hello_basic", "priority": "high", "reason": "Weak SRS retention"},
        {"lesson_id": "ja_u01_l02_greetings", "priority": "medium", "reason": "Next in sequence"}
    ]
    return {
        "user_id": req.userId,
        "recommendations": mock_suggestions,
        "ai_analysis": f"User has completed {len(req.completed_lessons)} lessons. Recommending revision of spaced-repetition cards."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
