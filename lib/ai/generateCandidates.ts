import { PuzzleCandidate } from '../types';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';

export async function generateCandidates(count: number = 20): Promise<PuzzleCandidate[]> {
  if (!OPENAI_API_KEY) {
    return getFallbackCandidates();
  }

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
    });

    if (!response.ok) {
      console.error('AI API error:', response.statusText);
      return getFallbackCandidates();
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return getFallbackCandidates();
    }

    const candidates = JSON.parse(jsonMatch[0]) as PuzzleCandidate[];
    return candidates.filter(c => 
      c.anchorA && 
      c.anchorB && 
      c.answer && 
      c.category
    );
  } catch (error) {
    console.error('Error generating candidates:', error);
    return getFallbackCandidates();
  }
}

function getFallbackCandidates(): PuzzleCandidate[] {
  return [
    { anchorA: 'Cold', anchorB: 'Hot', answer: 'Warm', category: 'temperature' },
    { anchorA: 'Bicycle', anchorB: 'Car', answer: 'Motorcycle', category: 'vehicle' },
    { anchorA: 'Whisper', anchorB: 'Shout', answer: 'Talk', category: 'volume' },
    { anchorA: 'Seed', anchorB: 'Tree', answer: 'Plant', category: 'lifecycle' },
    { anchorA: 'Tiny', anchorB: 'Huge', answer: 'Medium', category: 'size' },
    { anchorA: 'Dawn', anchorB: 'Dusk', answer: 'Noon', category: 'time' },
    { anchorA: 'Infant', anchorB: 'Elder', answer: 'Adult', category: 'age' },
    { anchorA: 'Freeze', anchorB: 'Boil', answer: 'Melt', category: 'temperature' },
    { anchorA: 'Walk', anchorB: 'Run', answer: 'Jog', category: 'speed' },
    { anchorA: 'Empty', anchorB: 'Full', answer: 'Half', category: 'quantity' },
    { anchorA: 'Start', anchorB: 'End', answer: 'Middle', category: 'position' },
    { anchorA: 'Dark', anchorB: 'Light', answer: 'Dim', category: 'brightness' },
    { anchorA: 'Quiet', anchorB: 'Loud', answer: 'Moderate', category: 'volume' },
    { anchorA: 'Slow', anchorB: 'Fast', answer: 'Medium', category: 'speed' },
    { anchorA: 'Small', anchorB: 'Large', answer: 'Medium', category: 'size' },
    { anchorA: 'Few', anchorB: 'Many', answer: 'Some', category: 'quantity' },
    { anchorA: 'Low', anchorB: 'High', answer: 'Medium', category: 'height' },
    { anchorA: 'Thin', anchorB: 'Thick', answer: 'Medium', category: 'width' },
    { anchorA: 'Easy', anchorB: 'Hard', answer: 'Medium', category: 'difficulty' },
    { anchorA: 'Rare', anchorB: 'Common', answer: 'Uncommon', category: 'frequency' },
  ];
}

