import { PuzzleCandidate, PuzzleRound } from '../types';
import { validateCandidate, scoreCandidate } from './validator';
import { getRecentPuzzles, getUsedAnchorPairs, getUsedAnswers } from './puzzleHistory';

export async function selectBestPuzzles(
  candidates: PuzzleCandidate[],
  count: number = 5
): Promise<PuzzleRound[]> {
  // Get history to filter out duplicates
  const recentPuzzles = await getRecentPuzzles(50);
  const usedAnchorPairs = getUsedAnchorPairs(recentPuzzles);
  const usedAnswers = getUsedAnswers(recentPuzzles);
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
  const batchUsedAnswers = new Set<string>();
  const batchUsedAnchors = new Set<string>();

  for (const candidate of valid) {
    if (selected.length >= count) break;

    const normalizedAnswer = candidate.normalizedAnswer;
    const anchorA = candidate.anchorA.toLowerCase().trim();
    const anchorB = candidate.anchorB.toLowerCase().trim();
    const anchorPair = [anchorA, anchorB].sort().join('|');

    // Check against both history AND current batch
    const isAnswerUsed = usedAnswers.has(normalizedAnswer) || batchUsedAnswers.has(normalizedAnswer);
    const isAnchorPairUsed = usedAnchorPairs.has(anchorPair) || batchUsedAnchors.has(anchorPair);

    if (!isAnswerUsed && !isAnchorPairUsed) {
      batchUsedAnswers.add(normalizedAnswer);
      batchUsedAnchors.add(anchorPair);
      selected.push(candidate);
    } else {
      console.log(`[Selector] Rejected duplicate: ${anchorA} — ${anchorB} → ${normalizedAnswer}`);
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

