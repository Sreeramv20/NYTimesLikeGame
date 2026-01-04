'use client';

import { useState, useEffect } from 'react';
import { DailyPuzzle, GameState, RoundResult, PlayerStats } from '@/lib/types';
import { checkAnswer } from '@/lib/puzzles/answerUtils';
import { getStats, updateStatsForGame, getCachedPuzzle, cachePuzzle, hasSeenIntro, markIntroSeen, clearCachedPuzzle } from '@/lib/storage';
import AnchorPair from '@/components/AnchorPair';
import AnswerInput from '@/components/AnswerInput';
import RoundIndicator from '@/components/RoundIndicator';
import StatsModal from '@/components/StatsModal';
import EndScreen from '@/components/EndScreen';
import IntroModal from '@/components/IntroModal';

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
  const [showIntro, setShowIntro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const seenIntro = hasSeenIntro();
    setShowIntro(!seenIntro);
    loadPuzzle();
  }, []);

  async function loadPuzzle(forceRefresh: boolean = false) {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      if (forceRefresh) {
        clearCachedPuzzle(today);
      }
      
      const cached = getCachedPuzzle(today);
      
      let dailyPuzzle;
      if (cached && !forceRefresh) {
        dailyPuzzle = cached;
      } else {
        console.log('[Client] Fetching puzzle from API...');
        const response = await fetch(`/api/puzzle?date=${today}`, {
          signal: AbortSignal.timeout(30000), // 30 second timeout
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('[Client] API error:', errorData);
          throw new Error(errorData.error || 'Failed to load puzzle');
        }
        
        const data = await response.json();
        console.log('[Client] Received puzzle:', data);
        
        if (!data || !data.rounds || !Array.isArray(data.rounds)) {
          throw new Error('Invalid puzzle data format');
        }
        
        dailyPuzzle = data;
        cachePuzzle(today, dailyPuzzle);
      }

      if (!dailyPuzzle || !dailyPuzzle.rounds || dailyPuzzle.rounds.length === 0) {
        throw new Error('Invalid puzzle data received');
      }

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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Full error:', error);
      alert(`Error loading puzzle: ${errorMessage}. Please try again.`);
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
        setFeedback('Correct');
        setTimeout(() => {
          setGameState({
            ...gameState,
            currentRound: gameState.currentRound + 1,
            attempts: 2,
            guesses: [],
          });
          setResults(newResults);
          setCurrentGuess('');
          setFeedback('');
        }, 800);
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
      setFeedback('Not quite');
      setCurrentGuess('');
    }
  }

  function handleShare() {
    if (!puzzle) return;

    const solved = results.filter(r => r.solved).length;
    const date = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const text = `Between ${date}\n${solved}/${puzzle.rounds.length} rounds solved\n\nPlay at: ${window.location.href}`;

    navigator.clipboard.writeText(text).then(() => {
      // Silent success - no alert needed for premium feel
    });
  }

  function handleNewGame() {
    loadPuzzle();
  }

  function handleCloseIntro() {
    markIntroSeen();
    setShowIntro(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary mb-2">Loading puzzle...</p>
          <p className="text-text-secondary text-xs opacity-60">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Error loading puzzle. Please refresh.</p>
      </div>
    );
  }

  if (gameState.isComplete || gameState.isFailed) {
    const timeTaken = gameState.endTime
      ? Math.floor((gameState.endTime - gameState.startTime) / 1000)
      : 0;

    return (
      <div className="min-h-screen py-16 px-4">
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
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-4xl font-serif text-text-primary mb-3 tracking-wide">
              Between
            </h1>
            <p className="text-sm text-text-secondary tracking-wide">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => loadPuzzle(true)}
              className="text-xs text-text-secondary hover:text-text-primary transition-colors tracking-wide"
              title="Regenerate today's puzzle"
            >
              Refresh
            </button>
            <button
              onClick={() => setShowStats(true)}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors tracking-wide"
            >
              Stats
            </button>
          </div>
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
          key={gameState.currentRound}
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

      <IntroModal
        isOpen={showIntro}
        onClose={handleCloseIntro}
      />
    </div>
  );
}

