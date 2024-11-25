import dotenv from "dotenv";
dotenv.config();

const browserSync = require('browser-sync');

browserSync.init({
    proxy: "http://localhost:3002", // Địa chỉ server của bạn
    files: ["src/views/**/*.ejs", "src/views/*.ejs", "public/**/*.*", "src/*"], // Theo dõi thay đổi file
    reloadDelay: 500, // Thời gian chờ reload
    open: false
});


import app from "./app";

import "./config/database";

const PORT = parseInt(process.env.PORT || "3006");
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});