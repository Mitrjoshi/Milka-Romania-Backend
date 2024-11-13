import sql from "mssql";
import dbConfig from "@/configs/dbConfig";

export interface I_RequestUpdateSong {
  songId: number;
  variant: number;
  voice: string;
  APIVideoReqJson: string;
  videoUuid: string;
  mixLink: string;
  vocalLink: string;
  videoLink: string;
  videoTitle: string;
}

export const UpdateSongModel = async (
  params: I_RequestUpdateSong
): Promise<boolean> => {
  let connection;

  try {
    connection = await sql.connect(dbConfig);
    const request = new sql.Request()
      .input("pSongID", sql.Int, params.songId)

      .input("pVariant", sql.TinyInt, params.variant)
      .input("pVoice", sql.NVarChar, params.voice)

      .input("pAPIVideoReqJson", sql.NVarChar, params.APIVideoReqJson)
      .input("pVideoUUID", sql.NVarChar, params.videoUuid)
      .input("pMixLink", sql.NVarChar, params.mixLink)
      .input("pVocalLink", sql.NVarChar, params.vocalLink)
      .input("pVideoLink", sql.NVarChar, params.videoLink)
      .input("pVideoTitle", sql.NVarChar, params.videoTitle);

    await request.execute("dbo.usp_updateSong");

    return true;
  } catch (err) {
    return false;
  } finally {
    if (connection && connection.connected) {
      await connection.close();
    }
  }
};
