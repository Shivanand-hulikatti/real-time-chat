import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { connectDB } from './lib/db';

import authRoutes from './routes/auth.routes';
import messageRoutes from './routes/message.routes';
import { app, server } from './lib/socket';
import path from 'path';


const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();


dotenv.config();

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}))
app.use(cookieParser());

app.use(express.json())


app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)


if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}


server.listen(PORT, () => {
  console.log('Server is running on http://localhost:3000');
  connectDB();
}); 
