import dotenv from "dotenv";
dotenv.config();
import app from './app';
import mongooseConnection from "./config/database";

mongooseConnection();

const PORT = parseInt(process.env.PORT || "3006", 10);
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
