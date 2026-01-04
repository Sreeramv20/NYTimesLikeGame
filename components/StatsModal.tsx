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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-gray-900">Statistics</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Games Played</span>
            <span className="font-serif text-gray-900">{stats.gamesPlayed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Games Won</span>
            <span className="font-serif text-gray-900">{stats.gamesWon}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Win Rate</span>
            <span className="font-serif text-gray-900">{winRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Current Streak</span>
            <span className="font-serif text-gray-900">{stats.currentStreak}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Max Streak</span>
            <span className="font-serif text-gray-900">{stats.maxStreak}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

