import {
  GenerateLyricsModel,
  I_RequestGenerateLyrics,
} from "@/model/GenerateLyricsModel";
import { UberduckGenerateLyrics } from "@/utils/UberduckGenerateLyrics";
import { Request, Response } from "express";

export const GenerateLyricsController = async (req: Request, res: Response) => {
  const {
    regId,
    msg,
    name,
    pronoun,
    relationship,
    spl,
    spendTime,
    theyLove,
    hobbies,
    laugh,
    favMem,
    lang,
  }: I_RequestGenerateLyrics = req.body;

  const requiredFields = {
    regId,
    msg,
    name,
    pronoun,
    relationship,
    spl,
    spendTime,
    theyLove,
    hobbies,
    laugh,
    favMem,
    lang,
  };

  const missingFields = Object.keys(requiredFields).filter(
    (key) => requiredFields[key as keyof I_RequestGenerateLyrics] === undefined
  );

  if (missingFields.length > 0) {
    res.status(400).send({
      error: `Missing required fields: ${missingFields.join(", ")}`,
      success: false,
    });
    return;
  }

  if (typeof regId !== "number") {
    res.status(400).send({
      error: `Type of regId should be number`,
      success: false,
    });
    return;
  }

  try {
    const lyricRequestJson = {
      gender: pronoun,
      occasion: msg,
      receiver_name: name,
      d1: relationship,
      q1: spl,
      q2: spendTime,
      q3: theyLove,
      q4: hobbies,
      q5: laugh,
      q6: favMem,
    };

    const responseByUberduck = await UberduckGenerateLyrics(lyricRequestJson);

    if (!responseByUberduck) {
      res.status(400).send({
        success: false,
        message: "External API failed",
      });
    }

    const modelRes = await GenerateLyricsModel({
      ...requiredFields,
      APILyricsReqJson: JSON.stringify(lyricRequestJson),
      lyrics: responseByUberduck?.choices[0].message.content,
    });

    if (!modelRes) {
      res.status(400).send({
        error: `Something went wrong.`,
        success: false,
      });
      return;
    }

    res.status(200).send({
      success: true,
      data: {
        lyrics: responseByUberduck?.choices[0].message.content,
        lyricsId: modelRes.pLyricsID,
        songId: modelRes.pSongID,
      },
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Something went wrong.",
    });
  }
};
