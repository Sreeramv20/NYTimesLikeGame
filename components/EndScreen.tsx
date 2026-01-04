'use client';

import { DailyPuzzle, RoundResult } from '@/lib/types';

interface EndScreenProps {
  puzzle: DailyPuzzle;
  results: RoundResult[];
  timeTaken: number;
  onShare: () => void;
  onNewGame: () => void;
}

export default function EndScreen({ puzzle, results, timeTaken, onShare, onNewGame }: EndScreenProps) {
  const solved = results.filter(r => r.solved).length;
  const failed = results.some(r => !r.solved);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-serif text-gray-900 mb-4">
        {failed ? 'Game Over' : 'Congratulations!'}
      </h2>
      <p className="text-gray-600 mb-6">
        You solved {solved} of {puzzle.rounds.length} rounds
      </p>
      <p className="text-sm text-gray-500 mb-8">Time: {formatTime(timeTaken)}</p>

      <div className="space-y-4 mb-8">
        {results.map((result, idx) => (
          <div key={idx} className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">
                Round {idx + 1}: {puzzle.rounds[idx].anchorA} — {puzzle.rounds[idx].anchorB}
              </span>
              <span className={result.solved ? 'text-green-600' : 'text-red-600'}>
                {result.solved ? '✓' : '✗'}
              </span>
            </div>
            {!result.solved && (
              <p className="text-sm text-gray-500">
                Answer: <span className="font-serif">{result.correctAnswer}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={onShare}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Share
        </button>
        <button
          onClick={onNewGame}
          className="px-6 py-2 bg-accent text-white rounded hover:bg-blue-600 transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

