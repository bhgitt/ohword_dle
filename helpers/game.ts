import { LOCALSTORAGE_KEY } from "../config";
import { getWinningAttempt } from "./attempts";

export const getSavedData = (): SavedData => {
  try {
    const existingDataRaw = window.localStorage.getItem(
      `${LOCALSTORAGE_KEY}.savedata`
    );
    if (!existingDataRaw) {
      window.localStorage.setItem(
        `${LOCALSTORAGE_KEY}.savedata`,
        JSON.stringify({})
      );
      throw new Error("no-saved-data");
    }
    const existingDataAsJson = JSON.parse(existingDataRaw) as SavedData;
    return existingDataAsJson;
  } catch (error) {
    return {};
  }
};

export const getSavedDataForCurrentWord = (
  savedData: SavedData,
  wordNumber: number
): SavedDataForSingleWord => {
  return savedData[wordNumber] || null;
};

export const hasWon = (attempts: Attempt[]): boolean => {
  return !!getWinningAttempt(attempts);
};

export const prunePastGamesData = (currentWordNumber: number): void => {
  const savedData = getSavedData();
  const pruned: SavedData = {};
  Object.entries(savedData).forEach(([wordNumber, data]) => {
    pruned[wordNumber] = data;
    if (Number(wordNumber) !== currentWordNumber && !!data.attempts) {
      delete pruned[wordNumber].attempts;
      if (data.status !== "WON") {
        pruned[wordNumber].status = "LOST";
      }
    }
  });
  window.localStorage.setItem(
    `${LOCALSTORAGE_KEY}.savedata`,
    JSON.stringify(pruned)
  );
};

export const saveDataForCurrentWord = (
  saveData: SavedDataForSingleWord,
  wordNumber: number
): SavedData => {
  try {
    const savedData = getSavedData();
    savedData[wordNumber] = { ...(savedData[wordNumber] || {}), ...saveData };
    window.localStorage.setItem(
      `${LOCALSTORAGE_KEY}.savedata`,
      JSON.stringify(savedData)
    );
    return savedData;
  } catch (error) {
    return {};
  }
};
