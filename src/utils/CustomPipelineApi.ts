import axios from "axios";

interface I_Request {
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

interface I_Response {
  success: boolean;
  message: string;
  trackID: number;
  lyrics: string;
  refID: number;
}

export const CustomPipelineGenerateLyrics = async (params: I_Request) => {
  try {
    const { data }: { data: I_Response } = await axios.post(
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
