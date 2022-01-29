import { AnimatePresence, motion, useAnimation } from "framer-motion";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "./ThemeContext";

type Props = {
  gameStatus: GameStatus;
  letter?: AttemptLetter;
  colSequence: number;
  rowSequence: number;
};

const LetterBlock: FC<Props> = ({
  gameStatus,
  letter,
  colSequence,
  rowSequence,
}) => {
  const [revealResult, setRevealResult] = useState(false);
  const animateBackground = useAnimation();

  const renderBackground = useCallback(() => {
    if (!letter?.result) {
      return null;
    }
    const getBackgroundClassName = () => {
      switch (letter.result) {
        case "GREEN":
          return "bg-green-400 dark:bg-green-700";
        case "YELLOW":
          return "bg-yellow-400 dark:bg-yellow-700";
        case "BLACK":
        default:
          return "bg-slate-100 dark:bg-slate-800";
      }
    };
    return (
      <motion.span
        className={`absolute inset-0 ${getBackgroundClassName()}`}
        initial={{ scale: 0, borderRadius: "100%" }}
        animate={animateBackground}
      />
    );
  }, [letter?.result, animateBackground]);

  const [borderColor, textColor] = useMemo(() => {
    if (!letter?.result || !revealResult) {
      return [
        "border-slate-200 dark:border-slate-700",
        "text-slate-600 dark:text-slate-200",
      ];
    }
    switch (letter.result) {
      case "GREEN":
        return [
          "border-green-500 dark:border-green-600",
          "text-green-800 dark:text-green-200",
        ];
      case "YELLOW":
        return [
          "border-yellow-500 dark:border-yellow-600",
          "text-yellow-800 dark:text-yellow-200",
        ];
      case "BLACK":
      default:
        return [
          "border-slate-200 dark:border-slate-700",
          "text-slate-600 dark:text-slate-200",
        ];
    }
  }, [letter?.result, revealResult]);

  useEffect(() => {
    if (letter?.result) {
      setTimeout(
        () => {
          setRevealResult(true);
        },
        gameStatus === "INITIALIZING" ? 0 : colSequence * 500
      );
    }
  }, [gameStatus, colSequence, letter?.result]);

  useEffect(() => {
    if (revealResult) {
      animateBackground.start({
        scale: 1,
        borderRadius: 0,
        transition: { duration: 0.5 },
      });
    }
  }, [revealResult, animateBackground]);

  return (
    <motion.div
      className={`flex-1 aspect-square border-2 ${borderColor} transition-colors duration-500 flex justify-center items-center relative rounded-lg overflow-hidden origin-center`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: [0.5, 1.1, 1],
        transition: {
          duration: 0.5,
          delay: (colSequence + rowSequence) * 0.05,
          ease: "easeOut",
          times: [0, 0.3, 1],
        },
      }}
    >
      {renderBackground()}
      <AnimatePresence>
        {!!letter && (
          <motion.span
            className={`relative text-5xl font-bold uppercase ${textColor} transition-colors duration-500`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: [0.5, 1.1, 1],
              transition: {
                duration: 0.1,
                ease: "easeInOut",
                times: [0, 0.3, 1],
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.5,
              transition: {
                duration: 0.1,
                ease: "easeInOut",
              },
            }}
          >
            {letter.char}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LetterBlock;
