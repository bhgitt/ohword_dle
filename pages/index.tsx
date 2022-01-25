import { lowerCase, times } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Head from "next/head";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import {
  appendAttemptResult,
  attemptToString,
  generateLetterHistoryFromAttemptResult,
  generateLetterHistoryFromAttempts,
  getWinningAttempt,
} from "../helpers/attempts";
import {
  getSavedDataForCurrentWord,
  hasWon,
  getSavedData,
  saveDataForCurrentWord,
} from "../helpers/game";
import { MAX_ATTEMPTS } from "../config";
import Keyboard from "../components/Keyboard";
import LetterBlock from "../components/LetterBlock";
import WinModal from "../components/WinModal";
import moment from "moment";

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  const [appHeight, setAppHeight] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>(
    times(MAX_ATTEMPTS, () => ({
      letters: [],
    }))
  );
  const [currentAttemptIndex, setCurrentAttemptIndex] = useState(0);
  const [dismissedWinModal, setDismissedWinModal] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [letterHistory, setLetterHistory] = useState<LetterHistory[]>([]);

  const savedData = useMemo(() => {
    const restoredSavedData = getSavedData();
    return getSavedDataForCurrentWord(restoredSavedData, props.wordNumber);
  }, [props.wordNumber]);

  const gameStatus: GameStatus = useMemo(() => {
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
    if (gameStatus === "WON") {
      return getWinningAttempt(attempts);
    }
  }, [gameStatus, attempts]);

  const handleSubmitAttempt = useCallback(async () => {
    if (gameStatus !== "PLAYING") {
      return;
    }
    setIsBusy(true);
    const currentAttempt = attempts[currentAttemptIndex];
    try {
      if (currentAttempt.letters.length < 5) {
        throw new Error("incorrect-word-length");
      }
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
      alert(error);
    }
  }, [attempts, currentAttemptIndex, gameStatus, letterHistory]);

  const handleKeyboardChange = useCallback(
    (newText: string) => {
      if (newText.length > 5 || gameStatus !== "PLAYING") {
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
    [gameStatus, currentAttemptIndex, attempts]
  );

  useEffect(() => {
    const windowResizeListener = () => {
      setAppHeight(window.innerHeight);
    };
    window.addEventListener("resize", windowResizeListener);
    windowResizeListener();
    return () => {
      window.removeEventListener("resize", windowResizeListener);
    };
  }, []);

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
      props.wordNumber
    );
  }, [attempts, props.wordNumber]);

  useEffect(() => {
    if (["WON", "LOST"].includes(gameStatus)) {
      saveDataForCurrentWord({ status: gameStatus }, props.wordNumber);
    }
  }, [gameStatus, props.wordNumber]);

  useEffect(() => {
    if (winningAttempt) {
      saveDataForCurrentWord({ winningAttempt }, props.wordNumber);
    }
  }, [winningAttempt, props.wordNumber]);

  return (
    <div>
      <Head>
        <title>Endy&apos;s Wordle</title>
        <meta
          name="description"
          content="Daily word-guessing game remake by Endy, inspired by the original Wordle game."
        />
        <meta
          name="image"
          property="og:image"
          content="https://wordle.endyhardy.me/cover.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="ndyhrdy" />
        <meta name="twitter:title" content="Endy's Wordle" />
        <meta
          name="twitter:description"
          content="Daily word-guessing game remake by Endy, inspired by the original Wordle game."
        />
        <meta
          name="twitter:image"
          content="https://wordle.endyhardy.me/cover.png"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        className="bg-slate-50 flex flex-col overflow-hidden"
        style={{ height: appHeight }}
      >
        <div className="container px-8 mx-auto bg-white max-w-lg shadow-lg flex-1 flex flex-col justify-center">
          <div className="py-4 lg:py-8 flex-initial flex flex-col space-y-2">
            {attempts.map((attempt, index) => {
              return (
                <div
                  className="flex space-x-2 justify-center"
                  key={`attempt-${index}`}
                >
                  {times(5, (charIndex) => {
                    const letter = attempt.letters[charIndex];
                    return (
                      <LetterBlock
                        key={`attempt-${index}-${charIndex}`}
                        gameStatus={gameStatus}
                        letter={letter}
                        colSequence={charIndex}
                        rowSequence={index}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <Keyboard
          text={attemptToString(attempts[currentAttemptIndex])}
          letterHistory={letterHistory}
          onChange={handleKeyboardChange}
          onSubmit={handleSubmitAttempt}
        />
      </main>
      <WinModal
        attempts={attempts}
        gameStatus={gameStatus}
        visible={["WON", "LOST"].includes(gameStatus) && !dismissedWinModal}
        onDismiss={() => {
          setDismissedWinModal(true);
        }}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const firstWordDate = process.env.FIRST_WORD_DATE;
  const daysPastSinceFirstWord = moment().diff(moment(firstWordDate), "days");
  return {
    props: {
      wordNumber: daysPastSinceFirstWord,
    },
  };
};

export default Home;
