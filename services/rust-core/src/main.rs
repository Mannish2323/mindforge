use axum::{
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use rand::seq::SliceRandom;

#[derive(Debug, Deserialize)]
struct ScoreRequest {
    answers: Vec<String>,
    correct_answers: Vec<String>,
    elapsed_seconds: u64,
}

#[derive(Debug, Serialize)]
struct ScoreResponse {
    score_percentage: u32,
    passed: bool,
    xp_rewarded: u32,
    cheated: bool,
    anti_cheat_reason: Option<String>,
}

#[derive(Debug, Deserialize)]
struct BlueprintScoreRequest {
    total_questions: i32,
    correct_answers: i32,
    time_seconds: i32,
}

#[derive(Debug, Serialize)]
struct BlueprintScoreResponse {
    accuracy: f64,
    xp: i32,
    mastery_delta: f64,
}

#[derive(Debug, Deserialize)]
struct AntiCheatRequest {
    user_id: String,
    elapsed_seconds: u64,
    score_percentage: u32,
    xp_gained: u32,
}

#[derive(Debug, Serialize)]
struct AntiCheatResponse {
    is_legit: bool,
    flagged: bool,
    reason: Option<String>,
}

#[derive(Debug, Deserialize)]
struct RecommendRequest {
    user_id: String,
    completed_lessons: Vec<String>,
    weak_words: Vec<String>,
}

#[derive(Debug, Serialize)]
struct RecommendResponse {
    next_lesson_id: String,
    review_words_priority: Vec<String>,
    motivation_message: String,
}

async fn health_check() -> &'static str {
    "Healthy - EVLO Rust Service"
}

async fn score_lesson(Json(payload): Json<ScoreRequest>) -> Json<ScoreResponse> {
    if payload.correct_answers.is_empty() {
        return Json(ScoreResponse {
            score_percentage: 0,
            passed: false,
            xp_rewarded: 0,
            cheated: false,
            anti_cheat_reason: Some("No questions provided".to_string()),
        });
    }

    let mut correct_count = 0;
    for (i, ans) in payload.answers.iter().enumerate() {
        if i < payload.correct_answers.len() && ans == &payload.correct_answers[i] {
            correct_count += 1;
        }
    }

    let score_percentage = (correct_count * 100) / payload.correct_answers.len() as usize;
    let passed = score_percentage >= 70;

    // Simple anti-cheat check in scoring
    let mut cheated = false;
    let mut reason = None;
    if payload.elapsed_seconds < 3 && payload.correct_answers.len() > 3 {
        cheated = true;
        reason = Some("Lesson completed too fast (under 3 seconds)".to_string());
    }

    let xp_rewarded = if cheated {
        0
    } else if passed {
        10
    } else {
        2
    };

    Json(ScoreResponse {
        score_percentage: score_percentage as u32,
        passed,
        xp_rewarded,
        cheated,
        anti_cheat_reason: reason,
    })
}

async fn score_lesson_blueprint(Json(payload): Json<BlueprintScoreRequest>) -> Json<BlueprintScoreResponse> {
    if payload.total_questions == 0 {
        return Json(BlueprintScoreResponse {
            accuracy: 0.0,
            xp: 0,
            mastery_delta: 0.0,
        });
    }

    let accuracy = payload.correct_answers as f64 / payload.total_questions as f64;
    let speed_bonus = if payload.time_seconds < 90 { 10 } else { 0 };
    let xp = (accuracy * 50.0) as i32 + speed_bonus;
    let mastery_delta = accuracy * 0.15;

    Json(BlueprintScoreResponse {
        accuracy,
        xp,
        mastery_delta,
    })
}

async fn check_anti_cheat(Json(payload): Json<AntiCheatRequest>) -> Json<AntiCheatResponse> {
    let mut is_legit = true;
    let mut flagged = false;
    let mut reason = None;

    if payload.elapsed_seconds < 5 && payload.score_percentage > 90 {
        is_legit = false;
        flagged = true;
        reason = Some("Perfect score in under 5 seconds is highly suspicious.".to_string());
    } else if payload.xp_gained > 100 {
        is_legit = false;
        flagged = true;
        reason = Some("XP gain single payload exceeds allowed limits (>100 XP).".to_string());
    }

    Json(AntiCheatResponse {
        is_legit,
        flagged,
        reason,
    })
}

async fn recommend_lesson(Json(payload): Json<RecommendRequest>) -> Json<RecommendResponse> {
    let mut rng = rand::thread_rng();
    
    // Simple logic: recommend lesson 2 if lesson 1 is complete, otherwise lesson 1.
    let next_lesson_id = if payload.completed_lessons.contains(&"ja_u01_l01_hello_basic".to_string()) {
        if payload.completed_lessons.contains(&"ja_u01_l02_greetings".to_string()) {
            "ja_u01_l03_asking_names".to_string()
        } else {
            "ja_u01_l02_greetings".to_string()
        }
    } else {
        "ja_u01_l01_hello_basic".to_string()
    };

    let mut priority_words = payload.weak_words.clone();
    priority_words.shuffle(&mut rng);
    
    let messages = [
        "がんばってください！ (Keep going!)",
        "Doing great! Ready for your next Japanese milestone?",
        "Continuous practice is the key to mastering Japanese!",
        "Next lesson awaits you. Let's build your streak!",
    ];
    let motivation_message = messages.choose(&mut rng).unwrap_or(&"Keep learning!").to_string();

    Json(RecommendResponse {
        next_lesson_id,
        review_words_priority: priority_words.into_iter().take(5).collect(),
        motivation_message,
    })
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/health", get(health_check))
        .route("/api/score", post(score_lesson))
        .route("/score", post(score_lesson_blueprint))
        .route("/api/anti-cheat", post(check_anti_cheat))
        .route("/api/recommend", post(recommend_lesson))
        .layer(CorsLayer::permissive());

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("EVLO Rust service running on http://{}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
