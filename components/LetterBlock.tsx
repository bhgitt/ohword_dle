import React, { FC, useCallback, useMemo } from "react";

type Props = {
  letter?: AttemptLetter;
};

const LetterBlock: FC<Props> = ({ letter }) => {
  const renderResultBlock = useCallback(() => {
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
    return <span className={`absolute inset-0 ${getBackgroundClassName()}`} />;
  }, [letter?.result]);

  const borderColor = useMemo(() => {
    if (!letter?.result) {
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
  }, [letter?.result]);

  return (
    <div
      className={`flex-1 aspect-square border-2 ${borderColor} flex justify-center items-center relative rounded-lg overflow-hidden`}
    >
      {renderResultBlock()}
      {!!letter && (
        <span className="relative text-5xl font-bold text-slate-600 uppercase">
          {letter.char}
        </span>
      )}
    </div>
  );
};

export default LetterBlock;
