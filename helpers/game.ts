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
  wordNumber: string
): SavedDataForSingleWord => {
  return savedData[wordNumber] || null;
};

export const hasWon = (attempts: Attempt[]): boolean => {
  return !!getWinningAttempt(attempts);
};

export const saveDataForCurrentWord = (
  saveData: SavedDataForSingleWord,
  wordNumber: string
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
