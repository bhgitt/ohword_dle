import { X } from "@styled-icons/feather";
import { AnimatePresence, motion } from "framer-motion";
import { last } from "lodash";
import React, { FC } from "react";
import { attemptToString, getWinningAttempt } from "../helpers/attempts";

type Props = {
  attempts: Attempt[];
  onDismiss: () => any;
  visible: boolean;
};

const WinModal: FC<Props> = ({ attempts, onDismiss, visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="win-modal"
          className="fixed inset-0 bg-white bg-opacity-80 flex items-center"
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
        >
          <button
            type="button"
            className="absolute top-4 lg:top-8 right-4 lg:right-8"
            onClick={onDismiss}
          >
            <X strokeWidth={2} size={32} />
          </button>

          <div className="container px-4 mx-auto">
            <h2 className="text-6xl text-center font-bold mb-2">Nice One!</h2>
            <p className="text-xl text-center mb-12">
              Word of the day:{" "}
              <span className="uppercase font-bold">
                {attemptToString(getWinningAttempt(attempts))}
              </span>
            </p>
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
