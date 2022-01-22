import { AnimatePresence, motion, useAnimation } from "framer-motion";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

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
          return "bg-green-400";
        case "YELLOW":
          return "bg-yellow-400";
        case "BLACK":
        default:
          return "bg-slate-100";
      }
    };
    return (
      <motion.span
        className={`absolute left-0 top-0 rounded-md ${getBackgroundClassName()}`}
        initial={{ width: 0, height: 0 }}
        animate={animateBackground}
      />
    );
  }, [letter?.result, animateBackground]);

  const borderColor = useMemo(() => {
    if (!letter?.result || !revealResult) {
      return "";
    }
    switch (letter.result) {
      case "GREEN":
        return "border-green-500";
      case "YELLOW":
        return "border-yellow-500";
      case "BLACK":
      default:
        return "border-slate-200";
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
        width: "100%",
        height: "100%",
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
            className="relative text-5xl font-bold text-slate-600 uppercase"
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
