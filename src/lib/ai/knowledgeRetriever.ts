/**
 * Sakura AI — Knowledge Retrieval Engine (RAG)
 * Grounding AI with local dictionary & lesson databases
 */

import { RetrievedKnowledge, UserIntent } from './types';
import { kanjiData, vocabData, grammarData } from '@/data/encyclopediaData';
import { fallbackRegistry } from '@/data/fallbackExplanations';

export async function retrieveKnowledge(
  query: string,
  intent: UserIntent
): Promise<RetrievedKnowledge | null> {
  const queryLower = query.toLowerCase();

  // 1. Search Kanji Data
  if (intent === 'kanji') {
    const matchedKanji = kanjiData.find(
      (k) =>
        k.kanji === query ||
        k.meaning.toLowerCase().includes(queryLower) ||
        k.onyomi.toLowerCase().includes(queryLower) ||
        k.kunyomi.toLowerCase().includes(queryLower)
    );
    if (matchedKanji) {
      return {
        topicTitle: `Kanji: ${matchedKanji.kanji} (${matchedKanji.meaning})`,
        kanjiInfo: [
          {
            character: matchedKanji.kanji,
            onyomi: matchedKanji.onyomi,
            kunyomi: matchedKanji.kunyomi,
            meaning: matchedKanji.meaning,
          },
        ],
        exampleSentences: matchedKanji.exampleSentence
          ? [{ ja: matchedKanji.exampleSentence, romaji: '', en: matchedKanji.exampleCompound }]
          : undefined,
        source: 'encyclopedia',
      };
    }
  }

  // 2. Search Vocab Data
  if (intent === 'vocabulary' || intent === 'translation') {
    const matchedVocab = vocabData.find(
      (v) =>
        v.japanese.includes(query) ||
        v.romaji.toLowerCase().includes(queryLower) ||
        v.english.toLowerCase().includes(queryLower)
    );
    if (matchedVocab) {
      return {
        topicTitle: `Vocabulary: ${matchedVocab.japanese} (${matchedVocab.english})`,
        vocabularyDefinitions: [
          {
            word: matchedVocab.japanese,
            reading: matchedVocab.romaji,
            meaning: matchedVocab.english,
          },
        ],
        exampleSentences: matchedVocab.exampleSentence
          ? [{ ja: matchedVocab.exampleSentence, romaji: '', en: matchedVocab.english }]
          : undefined,
        source: 'encyclopedia',
      };
    }
  }

  // 3. Search Grammar Data
  if (intent === 'grammar' || intent === 'jlpt') {
    const matchedGrammar = grammarData.find(
      (g) =>
        g.point.toLowerCase().includes(queryLower) ||
        g.meaning.toLowerCase().includes(queryLower)
    );
    if (matchedGrammar) {
      return {
        topicTitle: `Grammar Point: ${matchedGrammar.point}`,
        grammarRules: [matchedGrammar.meaning],
        exampleSentences: matchedGrammar.example
          ? [{ ja: matchedGrammar.example, romaji: '', en: matchedGrammar.meaning }]
          : undefined,
        source: 'encyclopedia',
      };
    }
  }

  // 4. Search Fallback Registry
  if (fallbackRegistry && typeof fallbackRegistry === 'object') {
    for (const [key, item] of Object.entries(fallbackRegistry)) {
      if (
        queryLower.includes(key.toLowerCase()) ||
        (item.japanese && item.japanese.toLowerCase().includes(queryLower)) ||
        (item.english && item.english.toLowerCase().includes(queryLower))
      ) {
        return {
          topicTitle: item.japanese || key,
          grammarRules: item.aiTutorExplanation ? [item.aiTutorExplanation] : undefined,
          exampleSentences: item.easySentenceJa
            ? [{ ja: item.easySentenceJa, romaji: item.romaji || '', en: item.easySentenceEn || '' }]
            : undefined,
          source: 'database',
        };
      }
    }
  }

  return null;
}
