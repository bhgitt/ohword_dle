import { motion, useAnimation } from "framer-motion";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  letter?: AttemptLetter;
  sequence: number;
};

const LetterBlock: FC<Props> = ({ letter, sequence }) => {
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
      setTimeout(() => {
        setRevealResult(true);
      }, sequence * 500);
    }
  }, [sequence, letter?.result]);

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
    <div
      className={`flex-1 aspect-square border-2 ${borderColor} transition-colors duration-500 flex justify-center items-center relative rounded-lg overflow-hidden`}
    >
      {renderBackground()}
      {!!letter && (
        <span className="relative text-5xl font-bold text-slate-600 uppercase">
          {letter.char}
        </span>
      )}
    </div>
  );
};

export default LetterBlock;
