import { UnlockCodeModel } from "@/model/UnlockCodeModel";
import { Request, Response } from "express";

export const UnlockCodeController = async (req: Request, res: Response) => {
  const { code }: { code: string } = req.body;

  if (typeof code !== "string") {
    res.status(400).json({ message: "Invalid Inputs", success: false });
    return;
  }

  try {
    const unlockCodeData = await UnlockCodeModel({
      code,
    });

    if (!unlockCodeData) {
      res.status(400).send({
        message: "Something went wrong.",
        success: false,
        unlockCodeData,
      });
      return;
    }

    if (!unlockCodeData.pVideoLink) {
      res
        .status(400)
        .send({ message: "Something went wrong.", success: false });
      return;
    }

    res.status(200).send({
      data: {
        msg: unlockCodeData.pMsg,
        receiver: unlockCodeData.pToName,
        sender: unlockCodeData?.pFromName?.split(" ")[0],
        songId: unlockCodeData.pSongID,
        title: unlockCodeData.pVideoTitle,
        unlockId: unlockCodeData.pUnlockID,
        video: unlockCodeData.pVideoLink,
      },
      success: true,
    });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong.", success: false });
  }
};
