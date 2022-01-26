import { motion, useAnimation } from "framer-motion";
import { times } from "lodash";
import React, { FC, useEffect } from "react";
import LetterBlock from "./LetterBlock";

type Props = Attempt & {
  error?: any;
  gameStatus: GameStatus;
  index: number;
};

const AttemptRow: FC<Props> = ({ error, gameStatus, index, letters }) => {
  const animateRow = useAnimation();

  useEffect(() => {
    if (error) {
      animateRow.start({
        x: [0, 20, -10, 0],
        transition: { duration: 0.5, bounce: 0.5, ease: "easeOut" },
      });
    }
  }, [animateRow, error]);

  return (
    <motion.div className="flex space-x-2 justify-center" animate={animateRow}>
      {times(5, (charIndex) => {
        const letter = letters[charIndex];
        return (
          <LetterBlock
            key={`attempt-letter-${charIndex}`}
            gameStatus={gameStatus}
            letter={letter}
            colSequence={charIndex}
            rowSequence={index}
          />
        );
      })}
    </motion.div>
  );
};

export default AttemptRow;
