interface RoundIndicatorProps {
  currentRound: number;
  totalRounds: number;
}

export default function RoundIndicator({ currentRound, totalRounds }: RoundIndicatorProps) {
  return (
    <div className="text-center mb-6">
      <p className="text-sm text-gray-600">
        Round {currentRound} of {totalRounds}
      </p>
    </div>
  );
}

