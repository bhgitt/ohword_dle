import { useEffect, useState } from "react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import moment from "moment";
import { useTheme } from "../components/ThemeContext";
import GameContextProvider from "../components/GameContext";
import Game from "../components/Game";

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  const [appHeight, setAppHeight] = useState(0);

  const { isDarkMode } = useTheme();

  useEffect(() => {
    const windowResizeListener = () => {
      setAppHeight(window.innerHeight);
    };
    window.addEventListener("resize", windowResizeListener);
    windowResizeListener();
    return () => {
      window.removeEventListener("resize", windowResizeListener);
    };
  }, []);

  return (
    <GameContextProvider wordNumber={props.wordNumber}>
      <div className={isDarkMode ? "dark" : ""}>
        <Head>
          <title>Endy&apos;s Wordle</title>
          <meta
            name="description"
            content="Daily word-guessing game remake by Endy, inspired by the original Wordle game."
          />
          <meta
            name="image"
            property="og:image"
            content="https://wordle.endyhardy.me/cover.png"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="ndyhrdy" />
          <meta name="twitter:title" content="Endy's Wordle" />
          <meta
            name="twitter:description"
            content="Daily word-guessing game remake by Endy, inspired by the original Wordle game."
          />
          <meta
            name="twitter:image"
            content="https://wordle.endyhardy.me/cover.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>

        <main
          className="bg-slate-50 dark:bg-slate-800 flex flex-col overflow-hidden transition-colors duration-200"
          style={{ height: appHeight }}
        >
          <Game />
        </main>
      </div>
    </GameContextProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const firstWordDate = process.env.FIRST_WORD_DATE;
  const daysPastSinceFirstWord = moment().diff(moment(firstWordDate), "days");
  return {
    props: {
      wordNumber: daysPastSinceFirstWord,
    },
  };
};

export default Home;
