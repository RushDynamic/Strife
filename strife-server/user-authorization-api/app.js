import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authorizationRoutes from './routes/authorization-routes.js';

dotenv.config();
const app = express();
var env = process.env.NODE_ENV || 'staging';
const port = env === 'production' ? 3002 : 4002;
mongoose
  .connect(process.env.MONGODB_CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log('User Authorization API started listening on port:', port);
    });
  });

app.use(express.json());
app.use('/auth', authorizationRoutes);
