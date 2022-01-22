import React, { FC, useMemo } from "react";

type RowButton = { label: string; onClick?: Function; width?: number };

type Props = {
  text: string;
  onChange: (newText: string) => any;
  onSubmit: () => any;
};

const Keyboard: FC<Props> = ({ text, onChange, onSubmit }) => {
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
          onClick: () => {
            if (text.length > 0) {
              onChange(text.slice(0, text.length - 1));
            }
          },
        },
        { label: "Enter", width: 1.5, onClick: onSubmit },
      ],
    ],
    [text, onChange, onSubmit]
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

              return (
                <button
                  key={button.label}
                  onClick={() => {
                    if (button.onClick) {
                      button.onClick(button);
                      return;
                    }
                    onChange(`${text}${button.label}`);
                  }}
                  className={`${getWidthClassName()} h-20 bg-slate-200 hover:bg-slate-300 text-slate-500 rounded-md text-2xl`}
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
