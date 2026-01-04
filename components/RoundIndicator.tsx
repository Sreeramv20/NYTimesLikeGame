interface RoundIndicatorProps {
  currentRound: number;
  totalRounds: number;
}

export default function RoundIndicator({ currentRound, totalRounds }: RoundIndicatorProps) {
  return (
    <div className="text-center mb-12">
      <p className="text-sm text-text-secondary tracking-wide">
        Round {currentRound} of {totalRounds}
      </p>
    </div>
  );
}

