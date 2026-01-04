import { PuzzleCandidate, PuzzleRound } from '../types';
import { validateCandidate, scoreCandidate } from './validator';

export function selectBestPuzzles(
  candidates: PuzzleCandidate[],
  count: number = 5
): PuzzleRound[] {
  const valid = candidates
    .filter(validateCandidate)
    .map(c => ({
      ...c,
      score: scoreCandidate(c),
      normalizedAnswer: c.answer.toLowerCase().trim(),
    }))
    .sort((a, b) => b.score - a.score);

  if (valid.length < count) {
    throw new Error(`Not enough valid puzzles. Found ${valid.length}, needed ${count}`);
  }

  const selected: typeof valid = [];
  const usedAnswers = new Set<string>();
  const usedAnchors = new Set<string>();

  for (const candidate of valid) {
    if (selected.length >= count) break;

    const normalizedAnswer = candidate.normalizedAnswer;
    const anchorA = candidate.anchorA.toLowerCase().trim();
    const anchorB = candidate.anchorB.toLowerCase().trim();
    const anchorPair = [anchorA, anchorB].sort().join('|');

    if (
      !usedAnswers.has(normalizedAnswer) &&
      !usedAnchors.has(anchorPair)
    ) {
      usedAnswers.add(normalizedAnswer);
      usedAnchors.add(anchorPair);
      selected.push(candidate);
    }
  }

  if (selected.length < count) {
    throw new Error(`Not enough unique puzzles. Found ${selected.length} unique, needed ${count}`);
  }

  return selected.map(({ anchorA, anchorB, answer, category }) => ({
    anchorA,
    anchorB,
    answer: answer.toLowerCase().trim(),
    category,
  }));
}

