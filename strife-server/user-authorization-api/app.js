import express from 'express';
import authorizationRoutes from './routes/authorization-routes.js';

const app = express();

app.listen(3002, () => {
    console.log("User Authorization API started listening on port 3002");
});

app.use('/auth', authorizationRoutes);
