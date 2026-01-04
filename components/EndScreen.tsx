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
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-serif text-text-primary mb-4 tracking-wide">
          {failed ? 'Completed' : 'Nice work'}
        </h2>
        <p className="text-text-secondary mb-2">
          You solved {solved} of {puzzle.rounds.length} rounds
        </p>
        <p className="text-sm text-text-secondary opacity-60">Time: {formatTime(timeTaken)}</p>
      </div>

      <div className="space-y-6 mb-16">
        {results.map((result, idx) => (
          <div key={idx} className="border-b border-divider pb-6 last:border-0">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <p className="text-text-secondary text-sm mb-1 tracking-wide">
                  Round {idx + 1}
                </p>
                <p className="text-text-primary font-serif text-lg">
                  {puzzle.rounds[idx].anchorA} — {puzzle.rounds[idx].anchorB}
                </p>
              </div>
              <span
                className={`ml-4 ${
                  result.solved ? 'text-accent' : 'text-text-secondary opacity-40'
                }`}
              >
                {result.solved ? '✓' : '—'}
              </span>
            </div>
            {!result.solved && result.correctAnswer && (
              <p className="text-sm text-text-secondary">
                Answer: <span className="font-serif text-text-primary">{result.correctAnswer}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={onShare}
          className="px-8 py-3 border border-divider rounded-lg text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors"
        >
          Share
        </button>
        <button
          onClick={onNewGame}
          className="px-8 py-3 bg-accent text-text-primary rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

