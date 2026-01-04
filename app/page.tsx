'use client';

import { useState, useEffect } from 'react';
import { DailyPuzzle, GameState, RoundResult, PlayerStats } from '@/lib/types';
import { checkAnswer } from '@/lib/puzzles/dailyPuzzle';
import { getStats, updateStatsForGame, getCachedPuzzle, cachePuzzle } from '@/lib/storage';
import AnchorPair from '@/components/AnchorPair';
import AnswerInput from '@/components/AnswerInput';
import RoundIndicator from '@/components/RoundIndicator';
import StatsModal from '@/components/StatsModal';
import EndScreen from '@/components/EndScreen';

export default function Home() {
  const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 0,
    attempts: 2,
    guesses: [],
    isComplete: false,
    isFailed: false,
    startTime: Date.now(),
  });
  const [currentGuess, setCurrentGuess] = useState('');
  const [feedback, setFeedback] = useState<string>('');
  const [results, setResults] = useState<RoundResult[]>([]);
  const [stats, setStats] = useState<PlayerStats>(getStats());
  const [showStats, setShowStats] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPuzzle();
  }, []);

  async function loadPuzzle() {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const cached = getCachedPuzzle(today);
      
      if (cached) {
        setPuzzle(cached);
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/puzzle?date=${today}`);
      if (!response.ok) {
        throw new Error('Failed to load puzzle');
      }
      
      const dailyPuzzle = await response.json();
      cachePuzzle(today, dailyPuzzle);
      setPuzzle(dailyPuzzle);
      setGameState({
        currentRound: 0,
        attempts: 2,
        guesses: [],
        isComplete: false,
        isFailed: false,
        startTime: Date.now(),
      });
      setResults([]);
      setCurrentGuess('');
      setFeedback('');
    } catch (error) {
      console.error('Error loading puzzle:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit() {
    if (!puzzle || gameState.isComplete || gameState.isFailed || !currentGuess.trim()) {
      return;
    }

    const currentRoundData = puzzle.rounds[gameState.currentRound];
    const isCorrect = checkAnswer(currentGuess, currentRoundData.answer);

    const newGuesses = [...gameState.guesses, currentGuess];
    const newAttempts = gameState.attempts - 1;

    if (isCorrect) {
      const newResult: RoundResult = {
        roundIndex: gameState.currentRound,
        solved: true,
        attempts: 2 - newAttempts,
      };
      const newResults = [...results, newResult];

      if (gameState.currentRound === puzzle.rounds.length - 1) {
        const endTime = Date.now();
        setGameState({
          ...gameState,
          isComplete: true,
          endTime,
        });
        setResults(newResults);
        updateStatsForGame(true);
        setStats(getStats());
      } else {
        setGameState({
          ...gameState,
          currentRound: gameState.currentRound + 1,
          attempts: 2,
          guesses: [],
        });
        setResults(newResults);
        setCurrentGuess('');
        setFeedback('');
      }
    } else if (newAttempts === 0) {
      const newResult: RoundResult = {
        roundIndex: gameState.currentRound,
        solved: false,
        attempts: 2,
        correctAnswer: currentRoundData.answer,
      };
      const newResults = [...results, newResult];
      const endTime = Date.now();

      setGameState({
        ...gameState,
        isFailed: true,
        endTime,
      });
      setResults(newResults);
      updateStatsForGame(false);
      setStats(getStats());
    } else {
      setGameState({
        ...gameState,
        attempts: newAttempts,
        guesses: newGuesses,
      });
      setFeedback('Not quite — try again');
      setCurrentGuess('');
    }
  }

  function handleShare() {
    if (!puzzle) return;

    const solved = results.filter(r => r.solved).length;
    const emoji = gameState.isComplete ? '🎉' : '😔';
    const text = `Between ${new Date().toLocaleDateString()}\n${emoji} ${solved}/${puzzle.rounds.length} rounds solved\n\nPlay at: ${window.location.href}`;

    navigator.clipboard.writeText(text).then(() => {
      alert('Results copied to clipboard!');
    });
  }

  function handleNewGame() {
    loadPuzzle();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading puzzle...</p>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Error loading puzzle. Please refresh.</p>
      </div>
    );
  }

  if (gameState.isComplete || gameState.isFailed) {
    const timeTaken = gameState.endTime
      ? Math.floor((gameState.endTime - gameState.startTime) / 1000)
      : 0;

    return (
      <div className="min-h-screen py-12 px-4">
        <EndScreen
          puzzle={puzzle}
          results={results}
          timeTaken={timeTaken}
          onShare={handleShare}
          onNewGame={handleNewGame}
        />
      </div>
    );
  }

  const currentRoundData = puzzle.rounds[gameState.currentRound];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif text-gray-900 mb-2">Between</h1>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <button
            onClick={() => setShowStats(true)}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Stats
          </button>
        </div>

        <RoundIndicator
          currentRound={gameState.currentRound + 1}
          totalRounds={puzzle.rounds.length}
        />

        <AnchorPair
          anchorA={currentRoundData.anchorA}
          anchorB={currentRoundData.anchorB}
        />

        <AnswerInput
          value={currentGuess}
          onChange={setCurrentGuess}
          onSubmit={handleSubmit}
          disabled={gameState.isComplete || gameState.isFailed}
          feedback={feedback}
          attemptsRemaining={gameState.attempts}
        />
      </div>

      <StatsModal
        stats={stats}
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />
    </div>
  );
}

