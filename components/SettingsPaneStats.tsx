import { BarChart2 } from "@styled-icons/feather";
import React, { useEffect, useRef, useState } from "react";
import StatsPane from "./StatsPane";

const SettingsPaneStats = () => {
  const [showPane, setShowPane] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showPane) {
      window.addEventListener(
        "click",
        () => {
          setShowPane(false);
        },
        { once: true }
      );
    }
  }, [showPane]);

  return (
    <div>
      <button
        type="button"
        ref={buttonRef}
        onClick={() => {
          setShowPane(true);
        }}
        className="text-slate-500 dark:text-slate-200 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center px-3 sm:px-4 h-10 sm:h-12 rounded-md sm:rounded-full"
      >
        <BarChart2 size={18} strokeWidth={2} />
        <span className="hidden sm:inline ml-2">Your Stats</span>
      </button>
      <StatsPane
        visible={showPane}
        buttonRect={buttonRef.current?.getBoundingClientRect()}
      />
    </div>
  );
};

export default SettingsPaneStats;
