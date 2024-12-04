import dotenv from "dotenv";
dotenv.config();
import app from './app';
import browserSync from 'browser-sync';

browserSync.init({
  proxy: "http://localhost:3002", 
  files: ["src/views/**/*.ejs", "src/views/*", "public/**/*.*", "src/*"], // Theo dõi thay đổi file
  reloadDelay: 500, 
    open: false
});

import './config/database';

// import { connectToDatabase } from './database';
// connectToDatabase();

const PORT = parseInt(process.env.PORT || "3006", 10);
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
