import { DailyPuzzle, PuzzleRound } from '../types';
import { generateCandidates } from '../ai/generateCandidates';
import { selectBestPuzzles } from './selector';
import { savePuzzleToHistory } from './puzzleHistory';

export async function getDailyPuzzle(date: string = new Date().toISOString().split('T')[0]): Promise<DailyPuzzle> {
  const maxAttempts = 5;
  let attempts = 0;
  let lastError: Error | null = null;

  while (attempts < maxAttempts) {
    attempts++;
    console.log(`[Puzzle] Attempt ${attempts}/${maxAttempts} to generate puzzle for ${date}`);
    
    try {
      const candidates = await generateCandidates(30);
      const rounds = await selectBestPuzzles(candidates, 5);
      
      const puzzle: DailyPuzzle = {
        date,
        rounds,
      };

      // Save to history for future reference
      await savePuzzleToHistory(puzzle);

      console.log(`[Puzzle] Successfully generated puzzle with ${rounds.length} rounds`);
      return puzzle;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`[Puzzle] Attempt ${attempts} failed:`, lastError.message);
      
      if (attempts < maxAttempts) {
        const delay = Math.min(1000 * attempts, 5000); // Exponential backoff, max 5s
        console.log(`[Puzzle] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // If we get here, all attempts failed
  throw new Error(
    `Failed to generate puzzle after ${maxAttempts} attempts. Last error: ${lastError?.message || 'Unknown error'}`
  );
}

// Answer checking functions moved to answerUtils.ts for client-side compatibility

