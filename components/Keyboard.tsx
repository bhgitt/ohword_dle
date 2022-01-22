import { lowerCase } from "lodash";
import React, { FC, useCallback, useMemo } from "react";

type RowButton = { label: string; onClick?: Function; width?: number };

type Props = {
  letterHistory: LetterHistory[];
  onChange: (newText: string) => any;
  onSubmit: () => any;
  text: string;
};

const Keyboard: FC<Props> = ({ letterHistory, onChange, onSubmit, text }) => {
  const handleBackspace = useCallback(() => {
    if (text.length > 0) {
      onChange(text.slice(0, text.length - 1));
    }
  }, [text, onChange]);

  const rows: RowButton[][] = useMemo(
    () => [
      [
        { label: "Q" },
        { label: "W" },
        { label: "E" },
        { label: "R" },
        { label: "T" },
        { label: "Y" },
        { label: "U" },
        { label: "I" },
        { label: "O" },
        { label: "P" },
      ],
      [
        { label: "A" },
        { label: "S" },
        { label: "D" },
        { label: "F" },
        { label: "G" },
        { label: "H" },
        { label: "J" },
        { label: "K" },
        { label: "L" },
      ],
      [
        { label: "Z" },
        { label: "X" },
        { label: "C" },
        { label: "V" },
        { label: "B" },
        { label: "N" },
        { label: "M" },
        {
          label: "Bksp",
          onClick: handleBackspace,
        },
        { label: "Enter", width: 1.5, onClick: onSubmit },
      ],
    ],
    [handleBackspace, onSubmit]
  );

  return (
    <div className="bg-white py-4 px-8 border-t flex flex-col space-y-2">
      {rows.map((row, index) => {
        return (
          <div
            className="flex justify-center space-x-2"
            key={`keyboard-row-${index}`}
          >
            {row.map((button) => {
              const getWidthClassName = () => {
                switch (button.width) {
                  case 1.5:
                    return "w-32";
                  case 1:
                  default:
                    return "w-20";
                }
              };

              const getBackgroundClassName = () => {
                const history = letterHistory.find(
                  (history) =>
                    lowerCase(history.char) === lowerCase(button.label)
                );
                if (!history) {
                  return "bg-slate-200 hover:bg-slate-300 text-slate-500";
                }
                switch (history.result) {
                  case "GREEN":
                    return "bg-green-300 hover:bg-green-400 text-green-800";
                  case "YELLOW":
                    return "bg-yellow-300 hover:bg-yellow-400 text-yellow-800";
                  case "BLACK":
                  default:
                    return "bg-slate-500 text-slate-200";
                }
              };

              return (
                <button
                  key={button.label}
                  onClick={() => {
                    if (button.onClick) {
                      button.onClick(button);
                      return;
                    }
                    onChange(`${text}${lowerCase(button.label)}`);
                  }}
                  className={`${getWidthClassName()} h-20 ${getBackgroundClassName()} rounded-md text-2xl`}
                >
                  {button.label}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Keyboard;
