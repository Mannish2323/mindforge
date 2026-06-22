# LEARN WITH VELMORTH — AI SYSTEM
## Section 8: AI System & Engines

---

## 8.1 AI SYSTEM OVERVIEW

The AI learning assistant (named "Velmorth" in-app) coordinates specialized intelligence engines to personalize the language learning curriculum. The backend gateway proxies API requests and handles security filters, utilizing Gemini, OpenAI, and Perplexity models.

```
┌─────────────────────────────────────────────────────────────┐
│                          API LAYER                          │
│          Node.js + Express REST Backend Gateway             │
└──────────────────────┬───────────────────┬──────────────────┘
                       │ Safe Proxied Requests
┌──────────────────────▼───────────────────▼──────────────────┐
│                     INTELLIGENCE LAYER                      │
│                                                             │
│   ┌──────────────────┐               ┌──────────────────┐   │
│   │ Translation      │               │ Word Meaning     │   │
│   │ (JA ⇄ EN)        │               │ (Usage/Synonyms) │   │
│   └──────────────────┘               └──────────────────┘   │
│   ┌──────────────────┐               ┌──────────────────┐   │
│   │ Sentence Break   │               │ Learning Assist  │   │
│   │ (Grammar/Vocab)  │               │ (Explanations)   │   │
│   └──────────────────┘               └──────────────────┘   │
└──────────────────────┬───────────────────┬──────────────────┘
                       │ Model Routing
┌──────────────────────▼───────────────────▼──────────────────┐
│                        MODEL LAYER                          │
│      Gemini API   │   OpenAI API   │   Perplexity API       │
└─────────────────────────────────────────────────────────────┘
```

---

## 8.2 CORE AI ENGINES

### 1. Translation Engine
- **Features**: Real-time translation between Japanese and English.
- **Accuracy**: Handles idiomatic expressions, slang, and polite registers (Keigo) by passing grammatical context cues to the model.

### 2. Word Meaning Engine
- **Features**: Generates word breakdowns showing:
  - Core definition / meaning
  - Pronunciation guide (furigana/romaji)
  - Cultural context and usage notes
  - Synonyms and antonyms
  - Contextual example sentences

### 3. Sentence Breakdown Engine
- **Features**: Deconstructs target-language sentences:
  - **Grammar Analysis**: Identifies particle usage, verb conjugations, and sentence structures.
  - **Vocabulary Analysis**: Isolates individual root words and compounds.

### 4. Learning Assistant
- **Features**:
  - **Personalized Explanations**: Diagnoses wrong answers and explains grammatical errors.
  - **Learning Recommendations**: Analyzes the student's history to recommend specific modules (e.g. "You missed particle 'ni' three times — let's review particle rules").

---

## 8.3 MODEL INTEGRATION PIPELINE (FUTURE)

The Express API gateway manages dynamic routing across models:
- **Gemini API**: Primary engine for logical grammar analysis and sentence deconstruction.
- **OpenAI API**: Backup for general dialog and translation services.
- **Perplexity API**: Searches online corpora for authentic native usage patterns and cultural references.
