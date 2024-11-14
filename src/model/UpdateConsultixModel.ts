import dbConfig from "@/configs/dbConfig";
import sql from "mssql";

interface I_Request {
  regId: number;
  consumerId: string;
  jobId: string;
}

export const UpdateConsultixModel = async (
  params: I_Request
): Promise<boolean> => {
  let connection;

  try {
    connection = await sql.connect(dbConfig);
    const request = new sql.Request()
      .input("pRegID", sql.Int, params.regId)
      .input("pConsumerId", sql.NVarChar, params.consumerId)
      .input("pJobId", sql.NVarChar, params.jobId);

    await request.execute("dbo.usp_updateConsultixData");

    return true;
  } catch (err) {
    return false;
  } finally {
    if (connection && connection.connected) {
      await connection.close();
    }
  }
};
