import "dotenv/config";
import { config as sqlConfig } from "mssql";

const dbConfig: sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST || "",
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustedConnection: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

export default dbConfig;
