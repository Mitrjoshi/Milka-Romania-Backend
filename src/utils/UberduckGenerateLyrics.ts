import axios from "axios";

interface I_Request {
  occasion: string;
  receiver_name: string;
  d1: string;
  gender: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
}

interface I_Response {
  choices: Array<{
    finish_reason: string;
    index: number;
    logprobs: null | any;
    message: {
      content: string;
      role: string;
      function_call: null | any;
      tool_calls: null | any;
    };
  }>;
  created: number;
  id: string;
  model: string;
  object: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
}

export const UberduckGenerateLyrics = async (params: I_Request) => {
  try {
    const { data }: { data: I_Response } = await axios.post(
      process.env.UBERDUCK_LYRICS_URL as string,
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
