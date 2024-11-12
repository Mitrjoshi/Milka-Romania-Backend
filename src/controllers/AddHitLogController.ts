import { Router, Request, Response } from "express";
import { AddHitLogModel } from "@/model/AddHitLogModel";
import { I_RequestHitLog } from "@/model/AddHitLogModel";

export const AddHitLogController = async (req: Request, res: Response) => {
  const { browser, device, os }: I_RequestHitLog = req.body;

  if (!device || !os || !browser) {
    res.json({ message: "Invalid Inputs", success: false });
    return;
  }

  const result = await AddHitLogModel({
    browser,
    device,
    ip: req?.ip || "0",
    os,
  });

  if (result) {
    res.status(200).send({ message: "Done", success: true });
  } else {
    res.status(400).send({ message: "Something went wrong.", success: false });
  }
};
