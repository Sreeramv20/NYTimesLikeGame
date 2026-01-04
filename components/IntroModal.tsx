'use client';

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IntroModal({ isOpen, onClose }: IntroModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-surface border border-divider rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-serif text-text-primary mb-2 tracking-wide">
              Between
            </h2>
            <p className="text-text-secondary text-sm tracking-wide">
              A daily puzzle game
            </p>
          </div>

          <div className="space-y-8 mb-10">
            <div>
              <h3 className="text-lg font-serif text-text-primary mb-3 tracking-wide">
                How to Play
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Each round presents two anchor concepts. Your goal is to find the single word or short phrase that lies logically between them.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-serif text-text-primary mb-3 tracking-wide">
                Rules
              </h3>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <span className="mr-3 text-accent">•</span>
                  <span>You have 2 attempts per round</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-accent">•</span>
                  <span>There are 5 rounds per day</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-accent">•</span>
                  <span>The game ends if you fail a round</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-accent">•</span>
                  <span>Everyone gets the same puzzle each day</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-serif text-text-primary mb-3 tracking-wide">
                Example
              </h3>
              <div className="bg-bg-primary rounded-lg p-6 border border-divider">
                <div className="flex items-center justify-center gap-8 mb-4">
                  <span className="text-2xl font-serif text-text-primary tracking-wide">
                    Cold
                  </span>
                  <span className="text-3xl text-text-secondary">—</span>
                  <span className="text-2xl font-serif text-text-primary tracking-wide">
                    Hot
                  </span>
                </div>
                <p className="text-center text-text-secondary text-sm">
                  Answer: <span className="font-serif text-text-primary">Warm</span>
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full px-8 py-4 bg-accent text-text-primary rounded-lg hover:opacity-90 transition-opacity font-medium text-lg"
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
}

