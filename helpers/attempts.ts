import { times } from "lodash";
import { MAX_ATTEMPTS } from "../config";

export const appendAttemptResult = (
  attempts: Attempt[],
  currentAttemptIndex: number,
  attemptResult: AttemptResponse
): Attempt[] => {
  const currentAttempt = attempts[currentAttemptIndex];
  return attempts.map((attempt, index) => {
    if (index !== currentAttemptIndex) {
      return attempt;
    }
    return {
      letters: currentAttempt.letters.map((char, index) => {
        const result = attemptResult.letters[index].result;
        return {
          ...char,
          result,
        };
      }),
    };
  });
};

export const appendLetterHistory = (
  letterHistory: LetterHistory[],
  attemptLetter: AttemptLetter
) => {
  if (!attemptLetter.result) {
    return letterHistory;
  }
  const existingHistoryIndex = letterHistory.findIndex(
    (history) => history.char === attemptLetter.char
  );
  if (existingHistoryIndex === -1) {
    letterHistory.push({
      char: attemptLetter.char,
      result: attemptLetter.result,
    });
    return letterHistory;
  }
  const newLetterHistory: LetterHistory[] = [...letterHistory];
  if (
    newLetterHistory[existingHistoryIndex].result === "YELLOW" &&
    attemptLetter.result === "GREEN"
  ) {
    newLetterHistory[existingHistoryIndex].result = attemptLetter.result;
  }
  return newLetterHistory;
};

export const attemptToString = (attempt?: Attempt | null): string => {
  if (!attempt) {
    return "";
  }
  return attempt.letters.reduce((agg, char) => `${agg}${char.char}`, "");
};

export const generateLetterHistoryFromAttemptResult = (
  currentHistory: LetterHistory[],
  results: AttemptLetter[]
): LetterHistory[] => {
  let newLetterHistory = [...currentHistory];
  results.forEach((letter) => {
    newLetterHistory = appendLetterHistory(newLetterHistory, letter);
  });
  return newLetterHistory;
};

export const generateLetterHistoryFromAttempts = (
  attempts: Attempt[]
): LetterHistory[] => {
  const attemptLetters = attempts.reduce<AttemptLetter[]>((agg, attempt) => {
    return [...agg, ...attempt.letters];
  }, []);
  let letterHistory: LetterHistory[] = [];
  attemptLetters.forEach((letter) => {
    letterHistory = appendLetterHistory(letterHistory, letter);
  });
  return letterHistory;
};

export const getDefaultAttemptsState = (): Attempt[] => {
  return times(MAX_ATTEMPTS, () => ({
    letters: [],
  }));
};

export const getWinningAttempt = (
  attempts: Attempt[]
): { attempt: Attempt; sequence: number } | null => {
  const winningAttemptIndex = attempts.findIndex(
    (attempt) =>
      attempt.letters.filter(({ result }) => result === "GREEN").length === 5
  );
  if (winningAttemptIndex === -1) {
    return null;
  }
  return {
    attempt: attempts[winningAttemptIndex],
    sequence: winningAttemptIndex,
  };
};

export const validateAttempt = (attempt: Attempt): void => {
  const word = attemptToString(attempt);
  if (word.length !== 5) {
    throw new Error("invalid-word-length");
  }
};
