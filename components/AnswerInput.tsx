'use client';

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
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled && value.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          placeholder="Type your answer..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded text-lg font-serif focus:outline-none focus:border-accent disabled:bg-gray-100"
        />
        <button
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="px-6 py-3 bg-accent text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Submit
        </button>
      </div>
      {feedback && (
        <p className={`text-center text-sm mt-2 ${feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>
          {feedback}
        </p>
      )}
      <p className="text-center text-xs text-gray-500 mt-2">
        {attemptsRemaining} {attemptsRemaining === 1 ? 'attempt' : 'attempts'} remaining
      </p>
    </div>
  );
}

