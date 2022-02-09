import { useState } from "react";
import { attemptToString } from "../helpers/attempts";
import { useGame } from "./GameContext";
import AttemptRow from "./AttemptRow";
import Keyboard from "./Keyboard";
import WinModal from "./WinModal";

const Game = () => {
  const [dismissedWinModal, setDismissedWinModal] = useState(false);
  const {
    attempts,
    currentAttemptIndex,
    error,
    letterHistory,
    onKeyboardChange,
    onSubmit,
    status: gameStatus,
  } = useGame();

  return (
    <>
      <div className="container px-8 mx-auto bg-white dark:bg-slate-900 max-w-lg shadow-lg flex-1 flex flex-col justify-center transition-colors duration-200">
        <div className="py-4 lg:py-8 flex-initial flex flex-col space-y-2">
          {attempts.map((attempt, index) => {
            return (
              <AttemptRow
                key={`attempt-${index}`}
                {...attempt}
                error={index === currentAttemptIndex ? error : null}
                index={index}
                gameStatus={gameStatus}
              />
            );
          })}
        </div>
      </div>
      <Keyboard
        text={attemptToString(attempts[currentAttemptIndex])}
        letterHistory={letterHistory}
        onChange={onKeyboardChange}
        onSubmit={onSubmit}
      />
      <WinModal
        attempts={attempts}
        gameStatus={gameStatus}
        visible={["WON", "LOST"].includes(gameStatus) && !dismissedWinModal}
        onDismiss={() => {
          setDismissedWinModal(true);
        }}
      />
    </>
  );
};

export default Game;
