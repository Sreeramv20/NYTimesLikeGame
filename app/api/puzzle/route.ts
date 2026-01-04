import { NextResponse } from 'next/server';
import { getDailyPuzzle } from '@/lib/puzzles/dailyPuzzle';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  try {
    console.log(`[API] Generating puzzle for date: ${date}`);
    const puzzle = await getDailyPuzzle(date);
    
    if (!puzzle || !puzzle.rounds || puzzle.rounds.length === 0) {
      throw new Error('Failed to generate valid puzzle');
    }
    
    console.log(`[API] Puzzle generated successfully with ${puzzle.rounds.length} rounds`);
    return NextResponse.json(puzzle);
  } catch (error) {
    console.error('[API] Error generating puzzle:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate puzzle';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

