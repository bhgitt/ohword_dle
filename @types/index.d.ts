type Attempt = {
  letters: AttemptLetter[];
};

type AttemptLetter = { char: string; result?: LetterResult };

type AttemptResponse = {
  letters: AttemptLetter[];
};

type ErrorResponse = { message?: string };

type GameStatus = "INITIALIZING" | "PLAYING" | "WON" | "LOST" | "BUSY";

type LetterHistory = { char: string; result: LetterResult };

type LetterResult = "BLACK" | "YELLOW" | "GREEN";

type PrunedAttempt = LetterResult[];

type SavedData = {
  [wordNumber: string]: SavedDataForSingleWord;
};

type SavedDataForSingleWord = {
  attempts?: Attempt[];
  prunedAttempts?: PrunedAttempt[];
  winningAttempt?: {
    attempt: Attempt;
    sequence: number;
  };
  status?: GameStatus;
};
