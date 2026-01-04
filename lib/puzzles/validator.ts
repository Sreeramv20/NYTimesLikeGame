import { PuzzleCandidate } from '../types';

export function validateCandidate(candidate: PuzzleCandidate): boolean {
  const { anchorA, anchorB, answer } = candidate;

  if (!anchorA || !anchorB || !answer) {
    return false;
  }

  if (anchorA.toLowerCase() === anchorB.toLowerCase()) {
    return false;
  }

  if (anchorA.toLowerCase() === answer.toLowerCase() || 
      anchorB.toLowerCase() === answer.toLowerCase()) {
    return false;
  }

  if (answer.split(/\s+/).length > 2) {
    return false;
  }

  if (isSynonym(anchorA, anchorB)) {
    return false;
  }

  if (!isCommonWord(answer)) {
    return false;
  }

  return true;
}

function isSynonym(word1: string, word2: string): boolean {
  const synonyms: Record<string, string[]> = {
    'big': ['large', 'huge', 'enormous'],
    'small': ['tiny', 'little', 'mini'],
    'fast': ['quick', 'rapid', 'swift'],
    'slow': ['sluggish', 'slack'],
    'hot': ['warm', 'heated'],
    'cold': ['cool', 'chilly'],
  };

  const w1 = word1.toLowerCase();
  const w2 = word2.toLowerCase();

  for (const [key, values] of Object.entries(synonyms)) {
    if ((key === w1 && values.includes(w2)) || (key === w2 && values.includes(w1))) {
      return true;
    }
    if (values.includes(w1) && values.includes(w2)) {
      return true;
    }
  }

  return false;
}

function isCommonWord(word: string): boolean {
  const commonWords = new Set([
    'warm', 'cool', 'medium', 'talk', 'plant', 'motorcycle', 'jog', 'half',
    'middle', 'dim', 'moderate', 'some', 'adult', 'noon', 'melt', 'uncommon',
    'average', 'normal', 'typical', 'standard', 'regular', 'moderate',
  ]);

  return commonWords.has(word.toLowerCase()) || word.length <= 8;
}

export function scoreCandidate(candidate: PuzzleCandidate): number {
  let score = 100;

  const { anchorA, anchorB, answer } = candidate;

  if (answer.length > 10) {
    score -= 10;
  }

  if (answer.split(/\s+/).length > 1) {
    score -= 5;
  }

  if (anchorA.length > 12 || anchorB.length > 12) {
    score -= 5;
  }

  if (candidate.category === 'size' || candidate.category === 'quantity') {
    score += 5;
  }

  if (candidate.confidence && candidate.confidence < 0.7) {
    score -= 20;
  }

  return Math.max(0, score);
}

