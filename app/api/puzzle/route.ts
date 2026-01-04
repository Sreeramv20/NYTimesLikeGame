import { NextResponse } from 'next/server';
import { getDailyPuzzle } from '@/lib/puzzles/dailyPuzzle';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  try {
    const puzzle = await getDailyPuzzle(date);
    return NextResponse.json(puzzle);
  } catch (error) {
    console.error('Error generating puzzle:', error);
    return NextResponse.json(
      { error: 'Failed to generate puzzle' },
      { status: 500 }
    );
  }
}

