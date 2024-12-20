import dbConfig from "@/configs/dbConfig";
import sql from "mssql";

export interface I_RequestHitLog {
  songId: string;
  regId: string;
  lyricsId: string;
}

interface I_Response {
  pLyrics: string;
  pMsg: string;
  pToName: string;
  pFromName: string;
  pLang: string;
  pTrackID: string;
}

export const GetSongDataModel = async (
  params: I_RequestHitLog
): Promise<I_Response | false> => {
  let connection;

  try {
    connection = await sql.connect(dbConfig);
    const request = new sql.Request()
      .input("pRegID", sql.Int, params.regId)
      .input("pSongID", sql.Int, params.songId)
      .input("pLyricsID", sql.Int, params.lyricsId)

      .output("pLyrics", sql.NVarChar)
      .output("pMsg", sql.NVarChar)
      .output("pToName", sql.NVarChar)
      .output("pFromName", sql.NVarChar)
      .output("pTrackID", sql.NVarChar)
      .output("pLang", sql.NVarChar);

    const data = await request.execute("dbo.usp_getSongData");

    return data.output as I_Response;
  } catch (err) {
    return false;
  } finally {
    if (connection && connection.connected) {
      await connection.close();
    }
  }
};
