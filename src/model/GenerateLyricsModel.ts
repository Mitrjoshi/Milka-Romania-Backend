import sql from "mssql";
import dbConfig from "@/configs/dbConfig";

export interface I_RequestGenerateLyrics {
  regId: number;
  msg: string;
  name: string;
  pronoun: string;
  relationship: string;
  spl: string;
  spendTime: string;
  theyLove: string;
  hobbies: string;
  laugh: string;
  favMem: string;
  lang: string;
}

interface I_Request extends I_RequestGenerateLyrics {
  lyrics?: string;
  APILyricsReqJson?: any;
}

interface I_Response {
  pSongID: number;
  pLyricsID: number;
}

export const GenerateLyricsModel = async (
  params: I_Request
): Promise<I_Response | false> => {
  let connection;

  try {
    connection = await sql.connect(dbConfig);
    const request = new sql.Request()
      .input("pRegID", sql.Int, params.regId)

      .input("pMsg", sql.NVarChar, params.msg)
      .input("pToName", sql.NVarChar, params.name)
      .input("pPronoun", sql.NVarChar, params.pronoun)
      .input("pRelation", sql.NVarChar, params.relationship)
      .input("pSpl", sql.NVarChar, params.spl)
      .input("pSpendTime", sql.NVarChar, params.spendTime)
      .input("pTheyLove", sql.NVarChar, params.theyLove)
      .input("pHobbies", sql.NVarChar, params.hobbies)
      .input("pLaugh", sql.NVarChar, params.laugh)
      .input("pFavMem", sql.NVarChar, params.favMem)

      .input("pLang", sql.NVarChar, params.lang)
      .input("pAPILyricsReqJson", sql.NVarChar, params.APILyricsReqJson)
      .input("pLyrics", sql.NVarChar, params.lyrics)

      .output("pSongID", sql.Int)
      .output("pLyricsID", sql.Int);

    const res = await request.execute("dbo.usp_addLyrics");

    return res.output as I_Response;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    if (connection && connection.connected) {
      await connection.close();
    }
  }
};
