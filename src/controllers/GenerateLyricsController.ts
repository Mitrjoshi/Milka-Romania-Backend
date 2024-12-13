import {
  GenerateLyricsModel,
  I_RequestGenerateLyrics,
} from "@/model/GenerateLyricsModel";
import { CustomPipelineGenerateLyrics } from "@/utils/CustomPipelineApi";
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
      msg,
      pronouns: pronoun,
      q1: spl,
      q2: spendTime,
      q3: theyLove,
      q4: hobbies,
      q5: laugh,
      q6: favMem,
      relation: relationship,
      receiverName: name,
      region: lang.toLowerCase(),
    };

    const responseByUberduck = await CustomPipelineGenerateLyrics(
      lyricRequestJson
    );

    if (!responseByUberduck) {
      res.status(400).send({
        success: false,
        message: "External API failed",
      });
    }

    const modelRes = await GenerateLyricsModel({
      ...requiredFields,
      APILyricsReqJson: JSON.stringify(lyricRequestJson),
      lyrics: responseByUberduck?.lyrics,
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
        lyrics: responseByUberduck?.lyrics,
        lyricsId: modelRes.pLyricsID,
        songId: modelRes.pSongID,
      },
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Something went wrong.",
      error,
    });
  }
};
