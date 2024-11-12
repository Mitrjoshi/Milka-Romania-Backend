import axios from "axios";

export interface I_UberduckGenerateSong {
  lyrics: string[][];
  backing_track: string;
  voicemodel_uuid: string;
  metadata: Metadata;
  render_video: boolean;
}

interface Metadata {
  version: string;
  variant: string;
  message: string;
  senderName: string;
  receiverName: string;
  language: string;
}

interface I_Response {}

export const UberduckGenerateSong = async (params: I_UberduckGenerateSong) => {
  try {
    const { data }: { data: I_Response } = await axios.post(
      process.env.UBERDUCK_VIDEO_URL as string,
      {
        variables: params,
      },
      {
        auth: {
          username: process.env.UBERDUCK_USERNAME as string,
          password: process.env.UBERDUCK_PASSWORD as string,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};
