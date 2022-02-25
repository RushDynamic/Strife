import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
const __dirname = path.resolve();
import authenticationRoutes from './routes/authentication-routes.js';
import friendRoutes from './routes/friend-routes.js';
import profileRoutes from './routes/profile-routes.js';

const app = express();
var env = process.env.NODE_ENV || 'staging';
const port = env === 'production' ? 3001 : 4001;
mongoose
  .connect(process.env.MONGODB_CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log('Account Management API started listening on port:', port);
    });
  })
  .catch((err) => {
    console.log(`Error occured during app startup: ${err}`);
  });
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN_URL_ARRAY.split(','),
  }),
);
//app.use(express.json());

app.use(cookieParser());
app.use('/account', express.json(), authenticationRoutes);
app.use('/friend', express.json(), friendRoutes);
app.use('/profile', fileUpload(), profileRoutes);
