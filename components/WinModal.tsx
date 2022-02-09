import { AnimatePresence, motion } from "framer-motion";
import { X } from "@styled-icons/feather";
import React, { FC, useEffect, useMemo } from "react";
import { attemptToString, getWinningAttempt } from "../helpers/attempts";
import Stats from "./Stats";

type Props = {
  attempts: Attempt[];
  onDismiss: () => any;
  gameStatus: GameStatus;
  visible: boolean;
};

const WinModal: FC<Props> = ({ attempts, gameStatus, onDismiss, visible }) => {
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

  const winningAttempt = getWinningAttempt(attempts);

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
                <p className="text-xl text-center">
                  Word of the day:{" "}
                  <span className="uppercase font-bold">
                    {attemptToString(winningAttempt.attempt)}
                  </span>
                </p>
              )}
            </div>
            <div className="mx-auto max-w-lg mb-6 bg-slate-800 p-4 lg:p-8 rounded-xl">
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
