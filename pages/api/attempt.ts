// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import moment from "moment";

type ResponseLetter = {
  char: string;
  status: LetterStatus;
};

type LetterStatus = "BLACK" | "YELLOW" | "GREEN";

type ErrorResponse = { message?: string };

type Response =
  | {
      letters: ResponseLetter[];
    }
  | ErrorResponse;

const getWordOfTheDay = async (): Promise<string> => {
  try {
    const wordsListFileContents = fs.readFileSync(
      process.cwd() + "/data/words.json",
      "utf-8"
    );
    const wordsList = JSON.parse(wordsListFileContents);
    const firstWordDate = process.env.FIRST_WORD_DATE;
    const daysPastSinceFirstWord = moment().diff(moment(firstWordDate), "days");
    if (!wordsList[daysPastSinceFirstWord]) {
      throw new Error("No word defined for today");
    }
    return wordsList[daysPastSinceFirstWord];
  } catch (error) {
    throw new Error("Failed to get word of the day: " + error);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
  const { word } = req.query;
  if (typeof word !== "string" || word.length !== 5) {
    res.status(422).json({ message: "Submitted word is invalid" });
    return;
  }
  const wordOfTheDay = await getWordOfTheDay();
  const letters: ResponseLetter[] = [];
  word.split("").forEach((letter, index) => {
    const getLetterStatus = (): LetterStatus => {
      if (wordOfTheDay[index] === letter) {
        return "GREEN";
      }
      if (wordOfTheDay.includes(letter)) {
        return "YELLOW";
      }
      return "BLACK";
    };
    const status: LetterStatus = getLetterStatus();
    letters.push({
      char: letter,
      status,
    });
  });
  res.status(200).json({ letters });
};

export default handler;
