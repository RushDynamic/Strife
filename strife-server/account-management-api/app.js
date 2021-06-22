import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authenticationRoutes from './routes/authentication-routes.js';

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

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(cookieParser());
app.use(express.json());
app.use('/account', authenticationRoutes);
