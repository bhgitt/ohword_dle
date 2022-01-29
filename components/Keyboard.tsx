import { Check, Delete } from "@styled-icons/feather";
import { lowerCase } from "lodash";
import { StyledIcon } from "@styled-icons/styled-icon";
import React, { FC, useCallback, useEffect, useMemo } from "react";
import SettingsPane from "./SettingsPane";

type RowButton = {
  icon?: StyledIcon;
  label: string;
  onClick?: Function;
  width?: number;
};

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
          icon: Delete,
          onClick: handleBackspace,
        },
        { label: "Enter", icon: Check, width: 1.5, onClick: onSubmit },
      ],
    ],
    [handleBackspace, onSubmit]
  );

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.metaKey) {
        return;
      }
      if (e.key.match(/^[a-zA-Z]$/)) {
        onChange(`${text}${lowerCase(e.key)}`);
      }
      if (e.key === "Backspace") {
        handleBackspace();
      }
      if (e.key === "Enter") {
        onSubmit();
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [onChange, text, handleBackspace, onSubmit]);

  return (
    <div className="bg-white dark:bg-slate-900 p-2 lg:py-4 lg:px-8 border-t border-slate-200 dark:border-slate-700 flex-none flex flex-col space-y-1 lg:space-y-2 transition-colors duration-500">
      <div className="self-center pb-2">
        <SettingsPane />
      </div>
      {rows.map((row, index) => {
        return (
          <div
            className="flex justify-center space-x-1 lg:space-x-2"
            key={`keyboard-row-${index}`}
          >
            {row.map((button) => {
              const getWidthClassName = () => {
                switch (button.width) {
                  case 1.5:
                    return "w-12 md:w-24 lg:w-32";
                  case 1:
                  default:
                    return "w-8 md:w-14 lg:w-16";
                }
              };

              const getBackgroundClassName = () => {
                const history = letterHistory.find(
                  (history) =>
                    lowerCase(history.char) === lowerCase(button.label)
                );
                if (!history) {
                  return "bg-slate-200 hover:bg-slate-300 active:bg-slate-300 text-slate-500 dark:bg-slate-600 dark:hover:bg-slate-700 dark:active:bg-slate-700 dark:text-slate-200";
                }
                switch (history.result) {
                  case "GREEN":
                    return "bg-green-300 hover:bg-green-400 active:bg-green-400 text-green-800 dark:bg-green-700 dark:hover:bg-green-800 dark:active:bg-green-800 dark:text-green-300";
                  case "YELLOW":
                    return "bg-yellow-300 hover:bg-yellow-400 active:bg-yellow-400 text-yellow-800 dark:bg-yellow-700 dark:hover:bg-yellow-800 dark:active:bg-yellow-800 dark:text-yellow-300";
                  case "BLACK":
                  default:
                    return "bg-slate-500 text-slate-200 dark:bg-slate-800 dark:text-slate-500";
                }
              };

              return (
                <button
                  key={button.label}
                  type="button"
                  onClick={() => {
                    if (button.onClick) {
                      button.onClick(button);
                      return;
                    }
                    onChange(`${text}${lowerCase(button.label)}`);
                  }}
                  className={`${getWidthClassName()} h-12 sm:h-16 md:h-16 ${getBackgroundClassName()} rounded-md text-lg md:text-xl transition-colors duration-100`}
                >
                  <span className={`${button.icon ? "hidden md:inline" : ""}`}>
                    {button.label}
                  </span>
                  {!!button.icon && (
                    <span className="md:hidden">
                      <button.icon strokeWidth={2} size={20} />
                    </span>
                  )}
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
