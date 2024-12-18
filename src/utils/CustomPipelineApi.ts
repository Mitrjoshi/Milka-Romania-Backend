import axios from "axios";

interface I_LyricsRequest {
  region: string;
  receiverName: string;
  msg: string;
  relation: string;
  pronouns: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
}

interface I_LyricsResponse {
  success: boolean;
  message: string;
  trackID: number;
  lyrics: string;
  refID: number;
}

export interface I_SongRequest {
  region: string;
  senderName: string;
  receiverName: string;
  msg: string;
  trackID: number;
  lyrics: string;
  tag: string;
}
interface I_SongResponse {
  success: boolean;
  message: string;
  songID: number;
}

export const CustomPipelineGenerateLyrics = async (params: I_LyricsRequest) => {
  try {
    const { data }: { data: I_LyricsResponse } = await axios.post(
      process.env.CUSTOM_PIPELINE_LYRICS_URL as string,
      params,
      {
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

export const CustomPipelineGenerateSong = async (params: I_SongRequest) => {
  try {
    const { data }: { data: I_SongResponse } = await axios.post(
      process.env.CUSTOM_PIPELINE_VIDEO_URL as string,
      params,
      {
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
