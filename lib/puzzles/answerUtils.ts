export function normalizeAnswer(answer: string): string {
  if (!answer) return '';
  return answer.toLowerCase().trim();
}

export function checkAnswer(guess: string, correctAnswer: string): boolean {
  if (!guess || !correctAnswer) return false;
  
  const normalizedGuess = normalizeAnswer(guess);
  const normalizedCorrect = normalizeAnswer(correctAnswer);
  
  return normalizedGuess === normalizedCorrect;
}

