import sql from "mssql";
import dbConfig from "@/configs/dbConfig";

export interface I_RequestIncreaseLyricsVersion {
  songId: number;
  APILyricsReqJson?: any;
  lyrics: string;
  trackID: number;
}

interface I_Response {
  pLyricsID: number;
}

export const IncreaseLyricsVersionModel = async (
  params: I_RequestIncreaseLyricsVersion
): Promise<I_Response | false> => {
  let connection;

  try {
    connection = await sql.connect(dbConfig);
    const request = new sql.Request()
      .input("pSongID", sql.Int, params.songId)
      .input("pLyrics", sql.NVarChar, params.lyrics)
      .input("pTrackID", sql.TinyInt, params.trackID)

      .output("pLyricsID", sql.Int);

    const res = await request.execute("dbo.usp_increaseLyricsVer");

    return res.output as I_Response;
  } catch (err) {
    return false;
  } finally {
    if (connection && connection.connected) {
      await connection.close();
    }
  }
};
