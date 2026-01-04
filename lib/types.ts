export interface PuzzleCandidate {
  anchorA: string;
  anchorB: string;
  answer: string;
  category: string;
  confidence?: number;
}

export interface PuzzleRound {
  anchorA: string;
  anchorB: string;
  answer: string;
  category: string;
}

export interface DailyPuzzle {
  date: string;
  rounds: PuzzleRound[];
}

export interface GameState {
  currentRound: number;
  attempts: number;
  guesses: string[];
  isComplete: boolean;
  isFailed: boolean;
  startTime: number;
  endTime?: number;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate?: string;
}

export interface RoundResult {
  roundIndex: number;
  solved: boolean;
  attempts: number;
  correctAnswer?: string;
}

