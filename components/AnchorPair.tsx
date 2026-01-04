interface AnchorPairProps {
  anchorA: string;
  anchorB: string;
}

export default function AnchorPair({ anchorA, anchorB }: AnchorPairProps) {
  return (
    <div className="flex items-center justify-center gap-12 my-16">
      <span className="text-3xl font-serif text-text-primary tracking-wide font-medium">
        {anchorA}
      </span>
      <span className="text-4xl text-text-secondary">—</span>
      <span className="text-3xl font-serif text-text-primary tracking-wide font-medium">
        {anchorB}
      </span>
    </div>
  );
}

