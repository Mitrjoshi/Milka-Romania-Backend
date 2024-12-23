import { Request, Response } from "express";
import { I_RequestGetCode } from "@/model/GetCodeModel";
import { GetVideoURLModel } from "@/model/GetVideoURLModel";

export const GetVideoURLController = async (req: Request, res: Response) => {
  const { songId }: I_RequestGetCode = req.body;

  if (typeof songId !== "number") {
    res.json({ message: "Invalid Inputs", success: false });
    return;
  }

  try {
    const result = await GetVideoURLModel(songId);

    if (!result) {
      res
        .status(400)
        .send({ message: "Something went wrong.", success: false });
      return;
    }

    res.status(200).send({
      isGenerated: result.pVideoStatus === "completed",
      success: true,
      videoURL: result.pVideoLink,
    });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Something went wrong.", success: false, error });
  }
};
