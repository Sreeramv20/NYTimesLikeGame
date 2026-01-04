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
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);

  if (valid.length < count) {
    throw new Error(`Not enough valid puzzles. Found ${valid.length}, needed ${count}`);
  }

  return valid.map(({ anchorA, anchorB, answer, category }) => ({
    anchorA,
    anchorB,
    answer: answer.toLowerCase().trim(),
    category,
  }));
}

