import { motion } from "framer-motion";
import { max, times } from "lodash";
import React, { useMemo } from "react";
import { getSavedData } from "../helpers/game";

const Stats = () => {
  const [played, stats, guesses] = useMemo(() => {
    const savedData = getSavedData();
    const savedDataAsArray = Object.entries(savedData).sort(
      ([wordNumberA], [wordNumberB]) =>
        Number(wordNumberA) - Number(wordNumberB)
    );
    const playedGames = savedDataAsArray.filter(([_, game]) => !!game.status);
    const played = playedGames.length;
    const wonGames = playedGames.filter(([_, game]) => game.status === "WON");
    const totalWins = wonGames.length;
    return [
      played,
      [
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
      ],
      (() => {
        const distribution = times(6, () => 0);
        wonGames.forEach(([_, { winningAttempt }]) => {
          if (winningAttempt) {
            distribution[winningAttempt?.sequence]++;
          }
        });
        return distribution;
      })(),
    ];
  }, []);

  return (
    <div className="text-slate-600 dark:text-slate-200">
      <ul className="flex flex-wrap -mx-1 mb-4">
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
      <p className="text-sm uppercase text-slate-400 mb-2">Winning Guess</p>
      <ul className="flex flex-col space-y-1">
        {guesses.map((count, index) => (
          <li
            className="flex bg-slate-100 dark:bg-slate-700"
            key={`guess-${index}`}
          >
            <div className="w-8 px-2 bg-slate-300 dark:bg-slate-400 text-slate-500 dark:text-slate-700">
              {index + 1}
            </div>
            <div className="flex-1">
              <motion.div
                className="h-full bg-slate-300 dark:bg-slate-400 rounded-r-full"
                initial={{ width: 0 }}
                animate={{
                  width: played ? `${(count / played) * 100}%` : 0,
                  transition: { delay: 0.3, duration: 0.5 },
                }}
              />
            </div>
            <div className="w-16 text-right px-2 text-slate-600 dark:text-slate-400">
              {(played ? (count / played) * 100 : 0).toFixed(0)}%
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stats;
