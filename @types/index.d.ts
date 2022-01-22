type Attempt = {
  letters: AttemptLetter[];
};

type AttemptLetter = { char: string; result?: LetterStatus };

type AttemptResponse = {
  letters: ResponseLetter[];
};

type ErrorResponse = { message?: string };

type GameStatus = "PLAYING" | "WON" | "LOST" | "BUSY";

type LetterHistory = { char: string; result: LetterStatus };

type LetterStatus = "BLACK" | "YELLOW" | "GREEN";

type ResponseLetter = {
  char: string;
  status: LetterStatus;
};

type SavedData = {
  [wordNumber: string]: SavedDataForSingleWord;
};

type SavedDataForSingleWord = {
  attempts?: Attempt[];
  winningAttempt?: {
    attempt: Attempt;
    sequence: number;
  };
  status?: GameStatus;
};
