import { PuzzleCandidate } from '../types';
import { getRecentPuzzles, formatPuzzlesForPrompt, getUsedAnchorPairs, getUsedAnswers } from '../puzzles/puzzleHistory';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';

export async function generateCandidates(count: number = 20): Promise<PuzzleCandidate[]> {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    throw new Error('OPENAI_API_KEY is required. Please set it in your .env.local file.');
  }
  
  console.log('[AI] Using OpenAI API to generate candidates');

  // Get recent puzzles to avoid duplicates
  const recentPuzzles = await getRecentPuzzles(50);
  const previousPuzzlesText = formatPuzzlesForPrompt(recentPuzzles);
  const usedAnchorPairs = getUsedAnchorPairs(recentPuzzles);
  const usedAnswers = getUsedAnswers(recentPuzzles);
  
  // Create explicit lists for the prompt
  const usedAnchorsList = Array.from(usedAnchorPairs).slice(0, 50).map(pair => {
    const [a, b] = pair.split('|');
    return `${a} — ${b}`;
  }).join(', ');
  
  const usedAnswersList = Array.from(usedAnswers).slice(0, 30).join(', ');

  const prompt = `Generate exactly ${count} "Between" puzzles. Each puzzle must have:
- Two anchor concepts (Anchor A and Anchor B) that form a clear spectrum or ordering
- One single-word or very short phrase answer that is the obvious middle concept
- A category describing the spectrum type (e.g., "temperature", "size", "intensity", "lifecycle", "speed")

Rules:
1. The answer must be a single common English word or very short phrase (max 2 words)
2. There must be exactly one obvious correct answer
3. Anchors should clearly imply an ordering (not synonyms)
4. Use common vocabulary only - no obscure words
5. The answer should be semantically equidistant from both anchors
6. IMPORTANT: Each answer word must be UNIQUE - no two puzzles should have the same answer
7. Each anchor pair should also be unique - avoid duplicate anchor combinations

CRITICAL - DO NOT REUSE:
8. NEVER use these anchor pairs (in any order): ${usedAnchorsList || 'None yet'}
9. NEVER use these answers: ${usedAnswersList || 'None yet'}

Previously used puzzles (for reference - avoid similar concepts):
${previousPuzzlesText || 'No previous puzzles.'}

You MUST create completely new anchor pairs and answers that are NOT in the lists above.

Format your response as a JSON array of objects with this exact structure:
[
  {
    "anchorA": "Cold",
    "anchorB": "Hot",
    "answer": "Warm",
    "category": "temperature"
  },
  ...
]

Return ONLY the JSON array, no other text.`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a puzzle generator for a word game. Return only valid JSON arrays.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error('[AI] API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    if (!content) {
      throw new Error('Empty response from OpenAI API');
    }
    
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('[AI] No JSON array found in response:', content.substring(0, 200));
      throw new Error('Invalid response format from OpenAI API - expected JSON array');
    }

    let candidates: PuzzleCandidate[];
    try {
      candidates = JSON.parse(jsonMatch[0]) as PuzzleCandidate[];
    } catch (parseError) {
      console.error('[AI] JSON parse error:', parseError);
      throw new Error('Failed to parse JSON response from OpenAI API');
    }

    const filtered = candidates.filter(c => 
      c.anchorA && 
      c.anchorB && 
      c.answer && 
      c.category
    );

    if (filtered.length === 0) {
      throw new Error('No valid candidates found in OpenAI response');
    }

    console.log(`[AI] Generated ${filtered.length} valid candidates`);
    return filtered;
  } catch (error) {
    console.error('[AI] Error generating candidates:', error);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('OpenAI API request timed out after 25 seconds');
    }
    // Re-throw the error instead of falling back
    throw error;
  }
}

