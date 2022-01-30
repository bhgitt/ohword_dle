import { max } from "lodash";
import React, { useMemo } from "react";
import { getSavedData } from "../helpers/game";

const Stats = () => {
  const stats = useMemo(() => {
    const savedData = getSavedData();
    const savedDataAsArray = Object.entries(savedData).sort(
      ([wordNumberA], [wordNumberB]) =>
        Number(wordNumberA) - Number(wordNumberB)
    );
    const playedGames = savedDataAsArray.filter(([_, game]) => !!game.status);
    const played = playedGames.length;
    const totalWins = playedGames.filter(
      ([_, game]) => game.status === "WON"
    ).length;
    return [
      {
        label: "Played",
        value: played,
      },
      {
        label: "Total Wins",
        value: totalWins,
      },
      {
        label: "Win Ratio",
        value: !played ? "0%" : `${((totalWins / played) * 100).toFixed(0)}%`,
      },
      {
        label: "Curr Streak",
        value: (() => {
          let streakCount = 0;
          for (let index = playedGames.length - 1; index >= 0; index--) {
            const [_, game] = playedGames[index];
            if (game.status === "WON") {
              streakCount++;
            } else {
              index = 0;
            }
          }
          return streakCount;
        })(),
      },
      {
        label: "Max Streak",
        value: (() => {
          const streakCounts = [0];
          for (let index = playedGames.length - 1; index >= 0; index--) {
            const [_, game] = playedGames[index];
            if (game.status === "WON") {
              streakCounts[streakCounts.length - 1]++;
            } else {
              streakCounts.push(0);
            }
          }
          return max(streakCounts) || 0;
        })(),
      },
      {
        label: "First Play",
        value: savedDataAsArray[0] ? `#${savedDataAsArray[0][0]}` : "N/A",
      },
    ];
  }, []);

  return (
    <div className="text-slate-600 dark:text-slate-200">
      <ul className="flex flex-wrap -mx-1 -mb-2">
        {stats.map(({ label, value }) => {
          return (
            <li key={label} className="w-1/3 sm:w-1/4 px-1 mb-2">
              <div className="bg-slate-200 dark:bg-slate-900 rounded-md p-4">
                <div className="text-xs sm:text-sm">{label}</div>
                <div className="text-2xl">{value || "0"}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Stats;
