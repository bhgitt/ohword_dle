import React, { FC, useCallback } from "react";
import { Moon, Sun } from "@styled-icons/feather";
import { useTheme } from "./ThemeContext";
import SettingsPaneStats from "./SettingsPaneStats";

const SettingsPane: FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const renderDarkModeToggle = useCallback(() => {
    const Icon = (() => {
      return isDarkMode ? Moon : Sun;
    })();

    return (
      <button
        type="button"
        onClick={toggleDarkMode}
        className="text-slate-500 dark:text-slate-200 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center px-3 sm:px-4 h-10 sm:h-12 rounded-md sm:rounded-full"
      >
        <Icon size={18} strokeWidth={2} />
        <span className="hidden sm:inline ml-2">
          Dark Mode: {isDarkMode ? "ON" : "OFF"}
        </span>
      </button>
    );
  }, [isDarkMode, toggleDarkMode]);

  return (
    <div className="px-8 flex-initial flex items-center space-x-1 sm:space-x-2 relative">
      {renderDarkModeToggle()}
      <SettingsPaneStats />
    </div>
  );
};

export default SettingsPane;
