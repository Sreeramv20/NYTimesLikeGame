import { PlayerStats, DailyPuzzle } from './types';

const STATS_KEY = 'between_stats';
const PUZZLE_CACHE_KEY = 'between_puzzle_cache';
const INTRO_SEEN_KEY = 'between_intro_seen';

export function getStats(): PlayerStats {
  if (typeof window === 'undefined') {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
    };
  }

  const stored = localStorage.getItem(STATS_KEY);
  if (!stored) {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
    };
  }

  return JSON.parse(stored);
}

export function saveStats(stats: PlayerStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function updateStatsForGame(won: boolean): void {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];
  const lastPlayed = stats.lastPlayedDate;

  stats.gamesPlayed += 1;

  if (won) {
    stats.gamesWon += 1;

    if (lastPlayed === today) {
      // Already played today, don't update streak
    } else if (lastPlayed && isConsecutiveDay(lastPlayed, today)) {
      stats.currentStreak += 1;
    } else {
      stats.currentStreak = 1;
    }

    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
  } else {
    stats.currentStreak = 0;
  }

  stats.lastPlayedDate = today;
  saveStats(stats);
}

function isConsecutiveDay(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

export function getCachedPuzzle(date: string): DailyPuzzle | null {
  if (typeof window === 'undefined') return null;
  const cached = localStorage.getItem(PUZZLE_CACHE_KEY);
  if (!cached) return null;
  const data = JSON.parse(cached);
  return data.date === date ? data.puzzle : null;
}

export function cachePuzzle(date: string, puzzle: DailyPuzzle): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PUZZLE_CACHE_KEY, JSON.stringify({ date, puzzle }));
}

export function hasSeenIntro(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(INTRO_SEEN_KEY) === 'true';
}

export function markIntroSeen(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(INTRO_SEEN_KEY, 'true');
}

