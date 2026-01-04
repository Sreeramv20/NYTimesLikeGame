import { DailyPuzzle, PuzzleRound } from '../types';
import { generateCandidates } from '../ai/generateCandidates';
import { selectBestPuzzles } from './selector';
import { getCachedPuzzle, cachePuzzle } from '../storage';

export async function getDailyPuzzle(date: string = new Date().toISOString().split('T')[0]): Promise<DailyPuzzle> {
  const cached = getCachedPuzzle(date);
  if (cached) {
    return cached;
  }

  let attempts = 0;
  let rounds: PuzzleRound[] = [];

  while (rounds.length < 5 && attempts < 3) {
    attempts++;
    const candidates = await generateCandidates(30);
    
    try {
      rounds = selectBestPuzzles(candidates, 5);
      break;
    } catch (error) {
      if (attempts >= 3) {
        rounds = getFallbackPuzzle().rounds;
        break;
      }
    }
  }

  const puzzle: DailyPuzzle = {
    date,
    rounds,
  };

  cachePuzzle(date, puzzle);
  return puzzle;
}

function getFallbackPuzzle(): DailyPuzzle {
  return {
    date: new Date().toISOString().split('T')[0],
    rounds: [
      { anchorA: 'Cold', anchorB: 'Hot', answer: 'warm', category: 'temperature' },
      { anchorA: 'Bicycle', anchorB: 'Car', answer: 'motorcycle', category: 'vehicle' },
      { anchorA: 'Whisper', anchorB: 'Shout', answer: 'talk', category: 'volume' },
      { anchorA: 'Seed', anchorB: 'Tree', answer: 'plant', category: 'lifecycle' },
      { anchorA: 'Tiny', anchorB: 'Huge', answer: 'medium', category: 'size' },
    ],
  };
}

export function normalizeAnswer(answer: string): string {
  if (!answer) return '';
  return answer.toLowerCase().trim();
}

export function checkAnswer(guess: string, correctAnswer: string): boolean {
  if (!guess || !correctAnswer) return false;
  
  const normalizedGuess = normalizeAnswer(guess);
  const normalizedCorrect = normalizeAnswer(correctAnswer);
  
  return normalizedGuess === normalizedCorrect;
}

