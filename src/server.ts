import dotenv from "dotenv";
dotenv.config();
import app from './app';
import browserSync from 'browser-sync';
import mongooseConnection from "./config/database";

browserSync.init({
  proxy: "http://localhost:3002", 
  files: ["src/views/**/*.ejs", "src/views/*", "public/**/*.*", "src/*"], // Theo dõi thay đổi file
  reloadDelay: 500, 
    open: false
});

mongooseConnection();

const PORT = parseInt(process.env.PORT || "3006", 10);
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
