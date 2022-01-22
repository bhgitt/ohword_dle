type AttemptLetter = { char: string; result?: LetterStatus };

type AttemptResponse = {
  letters: ResponseLetter[];
};

type ResponseLetter = {
  char: string;
  status: LetterStatus;
};

type LetterStatus = "BLACK" | "YELLOW" | "GREEN";

type ErrorResponse = { message?: string };

type LetterHistory = { char: string; result: LetterStatus };
