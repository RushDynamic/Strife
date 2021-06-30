import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
const __dirname = path.resolve();
import authenticationRoutes from './routes/authentication-routes.js';
import friendRoutes from './routes/friend-routes.js';

const app = express();

mongoose.connect(process.env.MONGODB_CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(3001, () => {
            console.log("Account Management API started listening on port 3001");
        });
    })
    .catch((err) => {
        console.log(`Error occured during app startup: ${err}`);
    });
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(cookieParser());
app.use(express.json());
app.use('/account', authenticationRoutes);
app.use('/friend', friendRoutes);
