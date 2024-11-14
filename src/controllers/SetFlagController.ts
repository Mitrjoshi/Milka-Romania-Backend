import { Request, Response } from "express";
import { I_RequestSetFlag, SetFlagModel } from "@/model/SetFlagModel";

export const SetFlagController = async (req: Request, res: Response) => {
  const { regId, songId, type }: I_RequestSetFlag = req.body;

  if (!songId || !type) {
    res.status(400).json({ message: "Invalid Inputs", success: false });
    return;
  }

  if (typeof songId !== "number") {
    res.status(400).json({ message: "Invalid inputs type", success: false });
    return;
  }

  const validTypes = [
    "share",
    "download",
    "create-again",
    "play",
    "unlock-play",
    "unlock-download",
    "unlock-share",
  ];

  if (!validTypes.includes(type)) {
    res.status(400).json({
      message: `Input type should be one of ${validTypes.join(", ")}`,
      success: false,
    });
    return;
  }

  try {
    const result = await SetFlagModel({
      regId,
      songId,
      type,
    });

    if (!result) {
      res
        .status(400)
        .send({ message: "Something went wrong.", success: false });
      return;
    }

    res.status(200).send({
      success: true,
      type,
    });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong.", success: false });
  }
};
