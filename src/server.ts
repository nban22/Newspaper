import dotenv from 'dotenv';
dotenv.config();

import app from './app';

import './config/database';



const PORT = parseInt(process.env.PORT || '3000');
const HOST = process.env.HOST || "localhost";

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});