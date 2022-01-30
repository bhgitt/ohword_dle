import { BarChart2 } from "@styled-icons/feather";
import { AnimatePresence, motion } from "framer-motion";
import React, { FC, useEffect, useState } from "react";
import Stats from "./Stats";

type Props = {
  buttonRect?: DOMRect;
  visible: boolean;
};

const StatsPane: FC<Props> = ({ buttonRect, visible }) => {
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowHeight(window?.innerHeight || 0);
    };
    window.addEventListener("resize", handleWindowResize);
    handleWindowResize();
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <div>
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black dark:bg-slate-900 bg-opacity-50 dark:bg-opacity-95 flex flex-col justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <motion.div
              key="pane"
              className="relative bg-white dark:bg-slate-800 rounded-xl w-full max-w-sm sm:max-w-lg p-4 mx-auto shadow-xl"
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{ bottom: windowHeight - (buttonRect?.top || 0) - 1 }}
              initial={{ scaleY: 0, originY: "100%" }}
              animate={{
                scaleY: 1,
                transition: { duration: 0.5, type: "spring" },
              }}
              exit={{
                scaleY: 0,
                transition: { duration: 0.3, ease: "easeIn" },
              }}
            >
              <Stats />
            </motion.div>
            <div
              className="absolute text-slate-500 dark:text-slate-200 bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center px-3 sm:px-4 h-10 sm:h-12 rounded-b-md sm:rounded-b-3xl"
              style={{
                left: buttonRect?.left,
                width: buttonRect?.width,
                bottom: windowHeight - (buttonRect?.bottom || 0),
              }}
            >
              <BarChart2 size={18} strokeWidth={2} />
              <span className="hidden sm:inline ml-2">Your Stats</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StatsPane;
