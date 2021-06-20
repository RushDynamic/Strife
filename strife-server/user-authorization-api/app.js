import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authorizationRoutes from './routes/authorization-routes.js';

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB_CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(3002, () => {
        console.log("User Authorization API started listening on port 3002");
    });
})


app.use(express.json());
app.use('/auth', authorizationRoutes);
