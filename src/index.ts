import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();

import { notFound, errorHandler } from './utils/middleware.js';
import userRoutes from './routes/userRoutes.js';

const server = express();
const PORT = process.env.PORT ?? 8080;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(cors());

server.use('/api/users/', userRoutes);

server.use(notFound);
server.use(errorHandler);

server.listen(Number(PORT), () => console.log(`Server 🚀 on port ${PORT}!`));
