import { NextResponse } from 'next/server';
import { callGemini, extractGeminiText, VELMORTH_SENSEI_PROMPT } from '../../../lib/gemini';

export async function POST(request: Request) {
  try {
    const { word } = await request.json();
    if (!word || typeof word !== 'string') {
      return NextResponse.json({ error: 'Word is required' }, { status: 400 });
    }

    const prompt = `
You are Velmorth Sensei, an expert Japanese teacher.
Generate a complete, comprehensive, and advanced Japanese learning structure for the word: "${word}".

You MUST return a JSON object with the exact keys below. Do NOT add markdown code fences (like \`\`\`json) outside the JSON. Return only the raw JSON string.

Keys required in JSON:
1. "japanese": The word itself (e.g. 食べる)
2. "hiragana": Hiragana representation (e.g. たべる)
3. "katakana": Katakana representation if applicable (or empty string "")
4. "romaji": Romaji spelling (e.g. Taberu)
5. "english": Core English translation (e.g. To Eat)
6. "hindi": Core Hindi meaning (e.g. खाना)
7. "simpleMeaning": A short, simple definition.
8. "detailedMeaning": An exhaustive linguistic definition of the word's behavior.
9. "wordType": The category (must be "Noun", "Verb", "Adjective", "Adverb", "Particle", or "Expression")
10. "jlptLevel": E.g., "N5", "N4", "N3", "N2", "N1"
11. "frequencyRank": Estimated frequency rank in common usage (e.g. Top 100, Top 500, etc.)
12. "usageRegister": E.g., "Formal / Informal", "Polite", "Casual", etc.
13. "commonSituations": Where it is commonly used (e.g. Daily life, Restaurants, business)
14. "memoryTrick": A mnemonic memory hook to help remember it (e.g. Taberu sounds like Table).
15. "rootBreakdown": Breakdown of kanji/radical components.
16. "synonyms": Synonyms of the word.
17. "opposites": Opposites of the word.
18. "easySentenceJa": An easy Japanese sentence using the word.
19. "easySentenceEn": English translation of the easy sentence.
20. "intermediateSentenceJa": An intermediate Japanese sentence using the word.
21. "intermediateSentenceEn": English translation of the intermediate sentence.
22. "advancedSentenceJa": An advanced Japanese sentence using the word.
23. "advancedSentenceEn": English translation of the advanced sentence.
24. "realLifeUsage": Context on where Japanese natives use it in daily life.
25. "commonMistakes": Pitfalls or mistakes learners make with this word.
26. "relatedGrammar": Grammar rules related to this word.
27. "relatedVocabulary": Vocab words related to this.
28. "pronunciationTips": Phonics/pronunciation hints.
29. "culturalNotes": Cultural context or etiquette related to the word.
30. "audioReadingText": Text that represents phonetic reading.
31. "emoji": Appropriate emoji association (e.g. 🍣)
32. "visualAssociation": Description of a visual image to associate with the word.
33. "difficulty": "Easy", "Medium", or "Hard"
34. "reviewPriority": Recommended review priority (High, Medium, Low)
35. "aiTutorExplanation": A warm, encouraging paragraph from Velmorth Sensei explaining how to use it.
`.trim();

    const data = await callGemini(
      [{ role: 'user', parts: [{ text: prompt }] }],
      VELMORTH_SENSEI_PROMPT
    );

    const rawText = extractGeminiText(data);
    
    // Strip code fences if the model included them anyway
    const jsonText = rawText
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();

    const parsedData = JSON.parse(jsonText);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('[Gemini Explainer] Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
