import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type ThemeContextValues = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextValues>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

const ThemeContextProvider: FC = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleDarkMode = useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const hasDarkModeSetAsSystemDefault = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(hasDarkModeSetAsSystemDefault);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, toggleDarkMode: handleToggleDarkMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;

export const useTheme = () => useContext(ThemeContext);
