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
    ip_address: Option<String>,
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

// ===== NEW SCHEMAS FOR PASSED REQUESTS =====

#[derive(Debug, Deserialize)]
struct WeakWordItem {
    vocab_id: String,
    kanji: String,
    romaji: String,
    ease: f64,
    error_count: Option<u32>,
}

#[derive(Debug, Deserialize)]
struct WeakWordsRequest {
    cards: Vec<WeakWordItem>,
}

#[derive(Debug, Serialize)]
struct MistakeCluster {
    cluster_id: String,
    word_ids: Vec<String>,
    error_count: u32,
    error_rate: f64,
    pattern_type: String,
    suggested_review: Vec<String>,
}

#[derive(Debug, Deserialize)]
struct LeagueRankRequest {
    xp_list: Vec<u32>,
    user_xp: u32,
}

#[derive(Debug, Serialize)]
struct LeagueRankResponse {
    rank: usize,
    tier: String,
    promoted: bool,
    demoted: bool,
}

#[derive(Debug, Deserialize)]
struct DuelScoreRequest {
    challenger_score: u32,
    opponent_score: u32,
    xp_stake: u32,
}

#[derive(Debug, Serialize)]
struct DuelScoreResponse {
    winner_id: String,
    xp_delta: i32,
    message: String,
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
    } else if let Some(ref ip) = payload.ip_address {
        // Simple mock IP check: if the IP contains "cheat" or "vpn"
        if ip.contains("cheat") || ip.contains("vpn") {
            is_legit = false;
            flagged = true;
            reason = Some("Request originating from suspected proxy/VPN IP.".to_string());
        }
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

// Cluster words by error frequency
async fn cluster_weak_words(Json(payload): Json<WeakWordsRequest>) -> Json<Vec<MistakeCluster>> {
    let mut weak_cards: Vec<&WeakWordItem> = payload.cards.iter()
        .filter(|c| c.error_count.unwrap_or(0) > 1 || c.ease < 1.8)
        .collect();

    if weak_cards.is_empty() {
        return Json(vec![]);
    }

    let mut clusters = vec![];

    // Pronunciation cluster: ease < 1.5
    let pron_words: Vec<String> = weak_cards.iter()
        .filter(|c| c.ease < 1.5)
        .map(|c| c.vocab_id.clone())
        .collect();
    if !pron_words.is_empty() {
        let error_count = weak_cards.iter()
            .filter(|c| c.ease < 1.5)
            .map(|c| c.error_count.unwrap_or(1))
            .sum();
        let error_rate = pron_words.len() as f64 / payload.cards.len().max(1) as f64;
        let suggested_review = weak_cards.iter()
            .filter(|c| c.ease < 1.5)
            .map(|c| c.kanji.clone())
            .take(5)
            .collect();
        clusters.push(MistakeCluster {
            cluster_id: "pronunciation".to_string(),
            word_ids: pron_words,
            error_count,
            error_rate,
            pattern_type: "pronunciation".to_string(),
            suggested_review,
        });
    }

    // Meaning cluster: ease >= 1.5
    let meaning_words: Vec<String> = weak_cards.iter()
        .filter(|c| c.ease >= 1.5)
        .map(|c| c.vocab_id.clone())
        .collect();
    if !meaning_words.is_empty() {
        let error_count = weak_cards.iter()
            .filter(|c| c.ease >= 1.5)
            .map(|c| c.error_count.unwrap_or(1))
            .sum();
        let error_rate = meaning_words.len() as f64 / payload.cards.len().max(1) as f64;
        let suggested_review = weak_cards.iter()
            .filter(|c| c.ease >= 1.5)
            .map(|c| c.kanji.clone())
            .take(5)
            .collect();
        clusters.push(MistakeCluster {
            cluster_id: "meaning".to_string(),
            word_ids: meaning_words,
            error_count,
            error_rate,
            pattern_type: "meaning".to_string(),
            suggested_review,
        });
    }

    Json(clusters)
}

// Compute league tier and rank
async fn league_rank(Json(payload): Json<LeagueRankRequest>) -> Json<LeagueRankResponse> {
    let mut all_xp = payload.xp_list.clone();
    all_xp.push(payload.user_xp);
    // Sort descending
    all_xp.sort_by(|a, b| b.cmp(a));
    
    let rank = all_xp.iter().position(|&x| x == payload.user_xp).unwrap_or(0) + 1;
    
    let tier = if payload.user_xp >= 2000 {
        "obsidian"
    } else if payload.user_xp >= 1000 {
        "diamond"
    } else if payload.user_xp >= 500 {
        "platinum"
    } else if payload.user_xp >= 250 {
        "gold"
    } else if payload.user_xp >= 100 {
        "silver"
    } else {
        "bronze"
    };

    let promoted = rank <= 3 && tier != "obsidian";
    let demoted = rank >= 25 && tier != "bronze";

    Json(LeagueRankResponse {
        rank,
        tier: tier.to_string(),
        promoted,
        demoted,
    })
}

// Compare two users' scores in a duel
async fn duel_score(Json(payload): Json<DuelScoreRequest>) -> Json<DuelScoreResponse> {
    if payload.challenger_score > payload.opponent_score {
        Json(DuelScoreResponse {
            winner_id: "challenger".to_string(),
            xp_delta: payload.xp_stake as i32,
            message: "🏆 You won the duel!".to_string(),
        })
    } else if payload.opponent_score > payload.challenger_score {
        Json(DuelScoreResponse {
            winner_id: "opponent".to_string(),
            xp_delta: -(payload.xp_stake as i32),
            message: "😤 Challenger wins this round.".to_string(),
        })
    } else {
        Json(DuelScoreResponse {
            winner_id: "draw".to_string(),
            xp_delta: 0,
            message: "🤝 It's a draw!".to_string(),
        })
    }
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/health", get(health_check))
        .route("/api/score", post(score_lesson))
        .route("/score", post(score_lesson_blueprint))
        .route("/api/anti-cheat", post(check_anti_cheat))
        .route("/api/recommend", post(recommend_lesson))
        .route("/api/weak-words", post(cluster_weak_words))
        .route("/api/league-rank", post(league_rank))
        .route("/api/duel-score", post(duel_score))
        .layer(CorsLayer::permissive());

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("EVLO Rust service running on http://{}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
