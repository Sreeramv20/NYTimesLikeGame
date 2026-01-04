'use client';

import { useEffect, useRef } from 'react';

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  feedback?: string;
  attemptsRemaining: number;
}

export default function AnswerInput({
  value,
  onChange,
  onSubmit,
  disabled,
  feedback,
  attemptsRemaining,
}: AnswerInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [disabled, feedback]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled && value.trim()) {
      onSubmit();
    }
  };

  const isCorrect = feedback?.includes('Correct');

  return (
    <div className="w-full">
      <div className="flex gap-3 mb-3">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          placeholder="Type your answer..."
          className="flex-1 px-5 py-4 bg-bg-surface border border-divider rounded-lg text-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        />
        <button
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="px-8 py-4 bg-accent text-text-primary rounded-lg hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity font-medium"
        >
          Submit
        </button>
      </div>
      {feedback && (
        <p
          className={`text-center text-sm mt-3 transition-opacity ${
            isCorrect ? 'text-accent' : 'text-text-secondary'
          }`}
        >
          {feedback}
        </p>
      )}
      <p className="text-center text-xs text-text-secondary mt-3 opacity-60">
        {attemptsRemaining} {attemptsRemaining === 1 ? 'attempt' : 'attempts'} remaining
      </p>
    </div>
  );
}

