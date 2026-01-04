'use client';

import { PlayerStats } from '@/lib/types';

interface StatsModalProps {
  stats: PlayerStats;
  isOpen: boolean;
  onClose: () => void;
}

export default function StatsModal({ stats, isOpen, onClose }: StatsModalProps) {
  if (!isOpen) return null;

  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-bg-surface border border-divider rounded-lg p-10 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-serif text-text-primary tracking-wide">Statistics</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary text-3xl leading-none transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="flex justify-between items-baseline border-b border-divider pb-4">
            <span className="text-text-secondary text-sm tracking-wide">Games Played</span>
            <span className="font-serif text-text-primary text-lg">{stats.gamesPlayed}</span>
          </div>
          <div className="flex justify-between items-baseline border-b border-divider pb-4">
            <span className="text-text-secondary text-sm tracking-wide">Games Won</span>
            <span className="font-serif text-text-primary text-lg">{stats.gamesWon}</span>
          </div>
          <div className="flex justify-between items-baseline border-b border-divider pb-4">
            <span className="text-text-secondary text-sm tracking-wide">Win Rate</span>
            <span className="font-serif text-text-primary text-lg">{winRate}%</span>
          </div>
          <div className="flex justify-between items-baseline border-b border-divider pb-4">
            <span className="text-text-secondary text-sm tracking-wide">Current Streak</span>
            <span className="font-serif text-text-primary text-lg">{stats.currentStreak}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-text-secondary text-sm tracking-wide">Max Streak</span>
            <span className="font-serif text-text-primary text-lg">{stats.maxStreak}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

