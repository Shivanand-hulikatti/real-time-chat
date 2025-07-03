import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { connectDB } from './lib/db';

import authRoutes from './routes/auth.routes';
import messageRoutes from './routes/message.routes';

dotenv.config();

const app = express();
app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}))
app.use(cookieParser());

app.use(express.json())


app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
  connectDB();
});
