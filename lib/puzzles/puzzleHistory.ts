import { DailyPuzzle, PuzzleRound } from '../types';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// This module uses Node.js fs APIs and should only be imported server-side

const HISTORY_FILE = path.join(process.cwd(), 'data', 'puzzle-history.json');
const MAX_HISTORY_DAYS = 90; // Keep last 90 days of puzzles

interface PuzzleHistory {
  puzzles: Array<{
    date: string;
    rounds: PuzzleRound[];
  }>;
  lastUpdated: string;
}

async function ensureDataDir(): Promise<void> {
  const dataDir = path.dirname(HISTORY_FILE);
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
}

export async function getPuzzleHistory(): Promise<PuzzleHistory> {
  try {
    await ensureDataDir();
    if (!existsSync(HISTORY_FILE)) {
      return { puzzles: [], lastUpdated: new Date().toISOString() };
    }
    const content = await readFile(HISTORY_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('[History] Error reading puzzle history:', error);
    return { puzzles: [], lastUpdated: new Date().toISOString() };
  }
}

export async function savePuzzleToHistory(puzzle: DailyPuzzle): Promise<void> {
  try {
    await ensureDataDir();
    const history = await getPuzzleHistory();
    
    // Remove existing puzzle for this date if it exists
    history.puzzles = history.puzzles.filter(p => p.date !== puzzle.date);
    
    // Add new puzzle
    history.puzzles.push({
      date: puzzle.date,
      rounds: puzzle.rounds,
    });
    
    // Keep only last MAX_HISTORY_DAYS days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - MAX_HISTORY_DAYS);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    history.puzzles = history.puzzles.filter(p => p.date >= cutoffDateStr);
    
    // Sort by date (newest first)
    history.puzzles.sort((a, b) => b.date.localeCompare(a.date));
    
    history.lastUpdated = new Date().toISOString();
    
    await writeFile(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
    console.log(`[History] Saved puzzle for ${puzzle.date}. Total puzzles in history: ${history.puzzles.length}`);
  } catch (error) {
    console.error('[History] Error saving puzzle to history:', error);
    // Don't throw - history is optional
  }
}

export async function getRecentPuzzles(count: number = 30): Promise<PuzzleRound[]> {
  const history = await getPuzzleHistory();
  const recent: PuzzleRound[] = [];
  
  // Get puzzles from most recent days, up to count rounds
  for (const puzzle of history.puzzles) {
    if (recent.length >= count) break;
    recent.push(...puzzle.rounds);
  }
  
  return recent.slice(0, count);
}

export function formatPuzzlesForPrompt(puzzles: PuzzleRound[]): string {
  if (puzzles.length === 0) {
    return 'No previous puzzles.';
  }
  
  return puzzles.map((p, idx) => 
    `${idx + 1}. ${p.anchorA} — ${p.anchorB} → ${p.answer} (${p.category})`
  ).join('\n');
}

export function getUsedAnchorPairs(puzzles: PuzzleRound[]): Set<string> {
  const pairs = new Set<string>();
  for (const puzzle of puzzles) {
    const anchorA = puzzle.anchorA.toLowerCase().trim();
    const anchorB = puzzle.anchorB.toLowerCase().trim();
    // Add both orderings to catch duplicates regardless of order
    pairs.add([anchorA, anchorB].sort().join('|'));
  }
  return pairs;
}

export function getUsedAnswers(puzzles: PuzzleRound[]): Set<string> {
  const answers = new Set<string>();
  for (const puzzle of puzzles) {
    answers.add(puzzle.answer.toLowerCase().trim());
  }
  return answers;
}

