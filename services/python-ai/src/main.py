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

# ===== NEW SCHEMAS FOR PASSED REQUESTS =====

class ChatMessage(BaseModel):
    message_id: str
    role: str
    content_ja: str
    content_romaji: str
    content_en: str
    timestamp: str

class ConversationRequest(BaseModel):
    session_id: str
    topic: str
    difficulty: str
    messages: List[ChatMessage]

class AdaptiveDifficultyRequest(BaseModel):
    accuracy_history: List[float]
    completed_count: int

class StoryHintRequest(BaseModel):
    story_id: str
    scene_id: str
    dialogue_history: List[str]

class MistakeAnalysisRequest(BaseModel):
    wrong_answer: str
    correct_answer: str
    question_type: str

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

@app.post("/api/ai/conversation")
def handle_conversation(req: ConversationRequest):
    # Generates next Japanese AI tutor response in the conversation session
    responses_dict = {
        "introduce": [
            {"ja": "はじめまして！お名前は何ですか？", "romaji": "Hajimemashite! O-namae wa nan desu ka?", "en": "Nice to meet you! What is your name?"},
            {"ja": "お元気ですか？最近どうですか？", "romaji": "O-genki desu ka? Saikin dou desu ka?", "en": "How are you? How have you been lately?"},
        ],
        "default": [
            {"ja": "なるほど！面白いですね。他には？", "romaji": "Naruhodo! Omoshiroi desu ne. Hoka ni wa?", "en": "I see! That's interesting. What else?"},
            {"ja": "素晴らしいですね！よく話せました。", "romaji": "Subarashii desu ne! Yoku hanasema-shita.", "en": "Wonderful! You spoke very well."},
        ]
    }
    
    topic_key = req.topic if req.topic in responses_dict else "default"
    choices = responses_dict[topic_key]
    ai_choice = random.choice(choices)
    
    score = random.randint(70, 98) if len(req.messages) > 0 else None
    
    return {
        "message_id": f"ai-{random.randint(1000,9999)}",
        "role": "ai",
        "content_ja": ai_choice["ja"],
        "content_romaji": ai_choice["romaji"],
        "content_en": ai_choice["en"],
        "timestamp": "2026-06-16T14:15:16Z",
        "score": score,
        "hint": "Try answering with '私の名前は...です' (My name is...)" if topic_key == "introduce" else "Keep speaking naturally!"
    }

@app.post("/api/ai/adaptive-difficulty")
def get_adaptive_difficulty(req: AdaptiveDifficultyRequest):
    avg_accuracy = sum(req.accuracy_history) / max(len(req.accuracy_history), 1)
    
    level = "beginner"
    if avg_accuracy >= 0.9 and req.completed_count >= 20:
        level = "expert"
    elif avg_accuracy >= 0.8 and req.completed_count >= 10:
        level = "advanced"
    elif avg_accuracy >= 0.7 and req.completed_count >= 5:
        level = "intermediate"
    elif avg_accuracy >= 0.6:
        level = "elementary"
        
    return {
        "recommended_level": level,
        "accuracy_7day": round(avg_accuracy * 100),
        "weak_areas": ["vocabulary", "particles"] if avg_accuracy < 0.7 else ["kanji"],
        "strong_areas": ["greetings", "numbers"] if avg_accuracy >= 0.8 else [],
        "next_lesson_id": "ja_u01_l01_hello_basic",
        "confidence_score": round(avg_accuracy * 100)
    }

@app.post("/api/ai/story-hint")
def get_story_hint(req: StoryHintRequest):
    hints = [
        "Pay attention to the social context (polite vs casual).",
        "Think about what a native speaker would say next.",
        "Choose the option that matches the staff's request.",
        "Remember to greet politely first!"
    ]
    return {
        "story_id": req.story_id,
        "scene_id": req.scene_id,
        "hint": random.choice(hints)
    }

@app.post("/api/ai/mistake-analysis")
def analyze_mistake(req: MistakeAnalysisRequest):
    explanation = f"You wrote '{req.wrong_answer}', but the correct answer is '{req.correct_answer}'."
    if req.question_type == "translate":
        explanation += " This error is common when mixing up particle markers or word ordering in translation."
    elif req.question_type == "fill":
        explanation += " Make sure to check the verb conjugation form before selecting the appropriate particle."
    else:
        explanation += " Double check the romaji readings or spelling rules for double consonants."
        
    return {
        "explanation": explanation,
        "pattern_type": "grammar" if req.question_type == "translate" else "spelling",
        "suggested_actions": ["Review unit vocabulary", "Practice writing simple sentences"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
