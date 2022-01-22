type AttemptResponse = {
  letters: ResponseLetter[];
};

type ResponseLetter = {
  char: string;
  status: LetterStatus;
};

type LetterStatus = "BLACK" | "YELLOW" | "GREEN";

type ErrorResponse = { message?: string };
