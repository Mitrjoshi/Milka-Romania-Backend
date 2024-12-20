import sql from "mssql";
import dbConfig from "@/configs/dbConfig";

export interface I_RequestUpdateSong {
  songId: number;
  status?: string;
  pVideoUUID?: string;
  pVideoLink?: string;
  pVideoError?: string | undefined;
}

export const UpdateSongModel = async (
  params: I_RequestUpdateSong
): Promise<boolean> => {
  let connection;

  try {
    connection = await sql.connect(dbConfig);
    const request = new sql.Request()
      .input("pSongID", sql.Int, params.songId)

      .input("pStatus", sql.NVarChar, params.status)
      .input("pVideoUUID", sql.NVarChar, params.pVideoUUID)

      .input("pVideoLink", sql.NVarChar, params.pVideoLink)
      .input("pVideoError", sql.NVarChar, params.pVideoError);

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
