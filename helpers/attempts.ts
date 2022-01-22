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
        const result = attemptResult.letters[index].status;
        return {
          ...char,
          result,
        };
      }),
    };
  });
};

export const attemptToString = (attempt?: Attempt | null): string => {
  if (!attempt) {
    return "";
  }
  return attempt.letters.reduce((agg, char) => `${agg}${char.char}`, "");
};

export const generateLetterHistoryFromAttemptResult = (
  currentHistory: LetterHistory[],
  results: ResponseLetter[]
): LetterHistory[] => {
  const newLetterHistory = [...currentHistory];
  results.forEach((letter) => {
    const existingHistoryIndex = newLetterHistory.findIndex(
      (history) => history.char === letter.char
    );
    if (existingHistoryIndex === -1) {
      newLetterHistory.push({
        char: letter.char,
        result: letter.status,
      });
      return;
    }
    if (
      newLetterHistory[existingHistoryIndex].result === "YELLOW" &&
      letter.status === "GREEN"
    ) {
      newLetterHistory[existingHistoryIndex].result = letter.status;
    }
  });
  return newLetterHistory;
};

export const getWinningAttempt = (attempts: Attempt[]): Attempt | null => {
  return (
    attempts.find(
      (attempt) =>
        attempt.letters.filter(({ result }) => result === "GREEN").length === 5
    ) || null
  );
};
