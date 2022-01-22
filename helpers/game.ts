export const hasWon = (attempts: Attempt[]): boolean => {
  return !!attempts.find(
    (attempt) =>
      attempt.letters.filter(({ result }) => result === "GREEN").length === 5
  );
};
