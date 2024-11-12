import { CheckLyricsVersionModel } from "@/model/CheckLyricsVersionModel";
import { IncreaseLyricsVersionModel } from "@/model/IncreaseLyricsVersionModel";
import { UberduckGenerateLyrics } from "@/utils/UberduckGenerateLyrics";
import { Request, Response } from "express";

interface I_Request {
  regId: number;
  songId: number;
}

export const RegenerateLyricsController = async (
  req: Request,
  res: Response
) => {
  const { regId, songId }: I_Request = req.body;

  const requiredFields = {
    regId,
    songId,
  };

  const missingFields = Object.keys(requiredFields).filter(
    (key) => requiredFields[key as keyof I_Request] === undefined
  );

  if (missingFields.length > 0) {
    res.status(400).send({
      error: `Missing required fields: ${missingFields.join(", ")}`,
      success: false,
    });
    return;
  }

  if (typeof regId !== "number" || typeof songId !== "number") {
    res.status(400).send({
      error: `Type of regId should be number`,
      success: false,
    });
    return;
  }

  try {
    const checkVersion = await CheckLyricsVersionModel({
      songId,
    });

    if (!checkVersion) {
      res.status(400).send({
        success: false,
        message: "Something went wrong.",
      });
      return;
    }

    const lyricRequestJson = {
      gender: checkVersion.pPronoun,
      occasion: checkVersion.pMsg,
      receiver_name: checkVersion.pToName,
      d1: checkVersion.pRelation,
      q1: checkVersion.pSpendTime,
      q2: checkVersion.pTheyLove,
      q3: checkVersion.pHobbies,
      q4: checkVersion.pLaugh,
      q5: checkVersion.pFavMem,
      q6: "",
    };

    if (!checkVersion.pAllow) {
      res.status(400).send({
        success: false,
        message: "Max Retry Limit Reached.",
      });

      return;
    }

    const responseByUberduck = await UberduckGenerateLyrics(lyricRequestJson);

    if (!responseByUberduck) {
      res.status(400).send({
        success: false,
        message: "External API failed",
      });
    }

    const increaseLyricVersion = await IncreaseLyricsVersionModel({
      APILyricsReqJson: JSON.stringify(lyricRequestJson),
      lyrics: responseByUberduck?.choices[0].message.content,
      songId,
    });

    if (!increaseLyricVersion) {
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
        lyricsId: increaseLyricVersion.pLyricsID,
        songId,
      },
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Something went wrong.",
    });
  }
};
