# Between - Daily Puzzle Game

A NYT-style daily puzzle game where players guess the concept that lies "between" two anchor concepts.

## Architecture

### Core Components

- **Puzzle Generation**: AI-assisted generation with deterministic validation
- **Daily Puzzles**: Cached puzzles based on date seed for consistency
- **Game State**: React hooks manage game flow and round progression
- **Storage**: localStorage for stats and puzzle caching

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks
- **AI**: OpenAI-compatible API (with fallback puzzles)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (optional, for AI generation):
```bash
# Create .env.local in the project root
OPENAI_API_KEY=your_api_key_here
OPENAI_API_URL=https://api.openai.com/v1/chat/completions
```

**Note**: If no API key is provided, the game will use fallback puzzles. The game is fully playable without an API key.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Puzzle Generation Flow

1. **Daily Determinism**: Each day uses the date (YYYY-MM-DD) as a seed, ensuring everyone gets the same puzzle
2. **AI Generation**: When a puzzle is needed, the system generates ~20 candidate puzzles using AI
3. **Validation**: Each candidate is validated deterministically:
   - Anchors must be different and not synonyms
   - Answer must be a common word/phrase
   - Answer must be semantically between the anchors
4. **Selection**: Best 5 puzzles are selected based on scoring
5. **Caching**: Puzzles are cached in localStorage to avoid regeneration

### Game Flow

- Player sees two anchor concepts
- Player types their guess (1-2 attempts per round)
- Game progresses through 5 rounds
- Game ends on completion or first failure
- Stats are tracked locally (streaks, win rate)

## Game Rules

- 5 rounds per day
- Each round has 2 anchor concepts
- Player has 2 attempts per round
- Game ends when all rounds are solved or a round is failed
- Same puzzle for everyone each day (deterministic by date)

## Project Structure

```
/app
  page.tsx          # Main game page
  layout.tsx        # Root layout
  globals.css       # Global styles
  /api
    /puzzle
      route.ts      # API endpoint for puzzle generation
/components
  AnchorPair.tsx    # Displays the two anchors
  AnswerInput.tsx  # Input field and submit button
  RoundIndicator.tsx # Shows current round
  StatsModal.tsx   # Statistics display
  EndScreen.tsx    # Game completion screen
/lib
  /ai
    generateCandidates.ts  # AI puzzle generation
  /puzzles
    validator.ts    # Puzzle validation logic
    selector.ts     # Best puzzle selection
    dailyPuzzle.ts  # Daily puzzle management
  types.ts         # TypeScript interfaces
  storage.ts       # localStorage utilities
```

## Features

- ✅ Daily deterministic puzzles
- ✅ AI-assisted puzzle generation with validation
- ✅ Local stats tracking (streaks, win rate)
- ✅ Clean, minimal UI
- ✅ Share functionality
- ✅ Fallback puzzles when AI unavailable

## Future Enhancements

- Difficulty levels
- Leaderboards
- Social sharing
- Animation polish
- Multiple game modes

