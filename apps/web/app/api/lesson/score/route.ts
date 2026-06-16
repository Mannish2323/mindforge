import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch("http://localhost:8080/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`Rust service returned status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[BFF Error] Score Lesson failed:", error.message);
    
    // Fallback logic
    const total_questions = 8;
    const correct_answers = 8;
    const accuracy = correct_answers / total_questions;
    return NextResponse.json({
      accuracy,
      xp: 50,
      mastery_delta: 0.15,
      fallback: true
    });
  }
}
