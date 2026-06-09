export function calculateWPM(characters: number, timeInSeconds: number): number {
  if (timeInSeconds <= 0) return 0;
  const minutes = timeInSeconds / 60;
  const words = characters / 5;
  return Math.round(words / minutes);
}

export function calculateAccuracy(correct: number, incorrect: number): number {
  const total = correct + incorrect;
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
}
