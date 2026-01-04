interface AnchorPairProps {
  anchorA: string;
  anchorB: string;
}

export default function AnchorPair({ anchorA, anchorB }: AnchorPairProps) {
  return (
    <div className="flex items-center justify-center gap-8 my-8">
      <span className="text-2xl font-serif text-gray-900">{anchorA}</span>
      <span className="text-3xl text-gray-400">—</span>
      <span className="text-2xl font-serif text-gray-900">{anchorB}</span>
    </div>
  );
}

