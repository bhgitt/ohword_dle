import axios from "axios";
import { lowerCase } from "lodash";
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MAX_ATTEMPTS } from "../config";
import {
  appendAttemptResult,
  attemptToString,
  generateLetterHistoryFromAttemptResult,
  generateLetterHistoryFromAttempts,
  getDefaultAttemptsState,
  getWinningAttempt,
  validateAttempt,
} from "../helpers/attempts";
import {
  getSavedData,
  getSavedDataForCurrentWord,
  hasWon,
  prunePastGamesData,
  saveDataForCurrentWord,
} from "../helpers/game";

type GameContextValues = {
  attempts: Attempt[];
  currentAttemptIndex: number;
  error: any;
  letterHistory: LetterHistory[];
  onKeyboardChange: (value: string) => void;
  onSubmit: () => void;
  status: GameStatus;
};

type ProviderProps = {
  wordNumber: number;
};

const GameContext = createContext<GameContextValues>({
  attempts: getDefaultAttemptsState(),
  currentAttemptIndex: 0,
  error: null,
  letterHistory: [],
  onKeyboardChange: () => {},
  onSubmit: () => {},
  status: "INITIALIZING",
});

const GameContextProvider: FC<ProviderProps> = ({ children, wordNumber }) => {
  const [attempts, setAttempts] = useState<Attempt[]>(
    getDefaultAttemptsState()
  );
  const [attemptError, setAttemptError] = useState<any>(null);
  const [currentAttemptIndex, setCurrentAttemptIndex] = useState(0);
  const [isBusy, setIsBusy] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [letterHistory, setLetterHistory] = useState<LetterHistory[]>([]);

  const savedData = useMemo(() => {
    const restoredSavedData = getSavedData();
    return getSavedDataForCurrentWord(restoredSavedData, wordNumber);
  }, [wordNumber]);

  const status: GameStatus = useMemo(() => {
    if (!isInitialized) {
      return "INITIALIZING";
    }
    if (isBusy) {
      return "BUSY";
    }
    if (hasWon(attempts)) {
      return "WON";
    }
    if (currentAttemptIndex + 1 > MAX_ATTEMPTS) {
      return "LOST";
    }
    return "PLAYING";
  }, [isInitialized, isBusy, attempts, currentAttemptIndex]);

  const winningAttempt = useMemo(() => {
    if (status === "WON") {
      return getWinningAttempt(attempts);
    }
  }, [status, attempts]);

  const handleKeyboardChange = useCallback(
    (newText: string) => {
      if (newText.length > 5 || status !== "PLAYING") {
        return;
      }
      setAttempts(
        attempts.map((attempt, index) => {
          if (index !== currentAttemptIndex) {
            return attempt;
          }
          return {
            letters: newText
              .split("")
              .map((newTextChar) => ({ char: lowerCase(newTextChar) })),
          };
        })
      );
    },
    [status, currentAttemptIndex, attempts]
  );

  const handleSubmitAttempt = useCallback(async () => {
    setAttemptError(null);
    if (status !== "PLAYING") {
      return;
    }
    setIsBusy(true);
    const currentAttempt = attempts[currentAttemptIndex];
    try {
      await validateAttempt(currentAttempt);
      const { data: attemptResult } = await axios.get<AttemptResponse>(
        "/api/attempt",
        {
          params: {
            word: attemptToString(currentAttempt),
          },
        }
      );
      setAttempts(
        appendAttemptResult(attempts, currentAttemptIndex, attemptResult)
      );
      setTimeout(() => {
        setCurrentAttemptIndex(currentAttemptIndex + 1);
        setLetterHistory(
          generateLetterHistoryFromAttemptResult(
            letterHistory,
            attemptResult.letters
          )
        );
        setIsBusy(false);
      }, 5 * 500);
    } catch (error) {
      setAttemptError(error);
      setIsBusy(false);
    }
  }, [attempts, currentAttemptIndex, status, letterHistory]);

  useEffect(() => {
    prunePastGamesData(wordNumber);
  }, [wordNumber]);

  useEffect(() => {
    if (savedData?.attempts) {
      const savedAttempts = savedData.attempts;
      setAttempts(savedAttempts);
      const currentAttemptIndex = savedAttempts.findIndex(
        (attempt) =>
          attempt.letters.findIndex((letter) => !!letter.result) === -1
      );
      setCurrentAttemptIndex(
        currentAttemptIndex === -1 ? MAX_ATTEMPTS + 1 : currentAttemptIndex
      );
      setLetterHistory(generateLetterHistoryFromAttempts(savedAttempts));
    }
    setTimeout(() => {
      setIsInitialized(true);
    }, 500);
  }, [savedData]);

  useEffect(() => {
    saveDataForCurrentWord(
      {
        attempts,
      },
      wordNumber
    );
  }, [attempts, wordNumber]);

  useEffect(() => {
    if (["WON", "LOST"].includes(status)) {
      saveDataForCurrentWord({ status: status }, wordNumber);
    }
  }, [status, wordNumber]);

  useEffect(() => {
    if (winningAttempt) {
      saveDataForCurrentWord({ winningAttempt }, wordNumber);
    }
  }, [winningAttempt, wordNumber]);

  return (
    <GameContext.Provider
      value={{
        attempts,
        currentAttemptIndex,
        error: attemptError,
        letterHistory,
        onKeyboardChange: handleKeyboardChange,
        onSubmit: handleSubmitAttempt,
        status,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;

export const useGame = () => useContext(GameContext);
