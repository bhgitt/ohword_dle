import { getWinningAttempt } from "./attempts";

export const hasWon = (attempts: Attempt[]): boolean => {
  return !!getWinningAttempt(attempts);
};
