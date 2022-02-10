import { AnimatePresence, motion } from "framer-motion";
import { Share, X } from "@styled-icons/feather";
import React, { FC, useCallback, useEffect, useMemo } from "react";
import { attemptToString, getWinningAttempt } from "../helpers/attempts";
import Stats from "./Stats";
import { useGame } from "./GameContext";
import { MAX_ATTEMPTS } from "../config";
import { useTheme } from "./ThemeContext";

type Props = {
  attempts: Attempt[];
  onDismiss: () => any;
  gameStatus: GameStatus;
  visible: boolean;
};

const WinModal: FC<Props> = ({ onDismiss, visible }) => {
  const { attempts, status: gameStatus, wordNumber } = useGame();
  const { isDarkMode } = useTheme();
  const winningAttempt = getWinningAttempt(attempts);

  const content = useMemo(() => {
    switch (gameStatus) {
      case "WON":
        return {
          title: "Nice One!",
        };
      case "LOST":
        return {
          title: "Aw, dang!",
        };
      default:
        return null;
    }
  }, [gameStatus]);

  const handleShare = useCallback(() => {
    if (!navigator?.share) {
      return;
    }
    let shareText = `Endy's Wordle ${wordNumber} ${
      winningAttempt ? winningAttempt.sequence + 1 : "X"
    }/${MAX_ATTEMPTS}\n\n`;
    attempts.forEach(({ letters }) => {
      if (letters.length !== 5) {
        return;
      }
      const attemptContent = letters.reduce((agg, { result }) => {
        const blockEmoji = (() => {
          switch (result) {
            case "GREEN":
              return "🟩";
            case "YELLOW":
              return "🟨";
            case "BLACK":
            default:
              return isDarkMode ? "⬛️" : "⬜️";
          }
        })();
        return agg + blockEmoji;
      }, "");
      shareText += `${attemptContent}\n`;
    });
    navigator.share({
      text: shareText,
    });
  }, [attempts, isDarkMode, winningAttempt, wordNumber]);

  useEffect(() => {
    if (visible) {
      const escapeListener = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onDismiss();
        }
      };
      window.addEventListener("keydown", escapeListener);
      return () => {
        window.removeEventListener("keydown", escapeListener);
      };
    }
  }, [visible, onDismiss]);

  return (
    <AnimatePresence>
      {visible && !!content && (
        <motion.div
          key="win-modal"
          className="fixed inset-0 bg-white dark:bg-slate-900 bg-opacity-90 dark:bg-opacity-95 flex items-center"
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
        >
          <button
            type="button"
            className="absolute top-4 lg:top-8 right-4 lg:right-8 text-slate-800 dark:text-slate-300"
            onClick={onDismiss}
          >
            <X strokeWidth={2} size={32} />
          </button>

          <div className="container px-4 mx-auto text-slate-800 dark:text-slate-300">
            <div className="mb-8">
              <h2 className="text-6xl text-center font-bold mb-2">
                {content?.title}
              </h2>

              {!!winningAttempt && (
                <p className="text-xl text-center mb-2">
                  Word of the day:{" "}
                  <span className="uppercase font-bold">
                    {attemptToString(winningAttempt.attempt)}
                  </span>
                </p>
              )}
              {!!navigator.canShare && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="text-slate-500 dark:text-slate-200 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center px-3 sm:px-4 h-10 sm:h-12 rounded-md sm:rounded-full"
                  >
                    <span className="mr-2">Share</span>
                    <Share size={18} strokeWidth={2} />
                  </button>
                </div>
              )}
            </div>
            <div className="mx-auto max-w-lg mb-6 dark:bg-slate-800 p-4 lg:p-8 rounded-xl">
              <Stats />
            </div>
            <p className="text-center">
              Thank you for playing Endy&apos;s Wordle today!
              <br />
              Come back tomorrow for a new word.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WinModal;
