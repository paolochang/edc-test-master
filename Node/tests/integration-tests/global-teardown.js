import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { URL } from "url";
import path from "path";

const __dirname = new URL(".", import.meta.url).pathname;
dotenv.config({ path: path.resolve(__dirname, "../../.env.test") });

export default async function teardown() {
  return new Promise(async (resolve) => {
    const connection = await mysql.createConnection({
      host: process.env["DB_HOST"],
      user: process.env["DB_USER"],
      database: process.env["DB_DATABASE"],
      password: process.env["DB_PASSWORD"],
    });

    try {
      await connection.execute("DROP TABLE tweets, users");
      console.log("tweets and users tables are dropped.");
    } catch (err) {
      console.log("Somthing went wrong when cleaning the DB", err);
    } finally {
      connection.end();
    }

    resolve();
  });
}
