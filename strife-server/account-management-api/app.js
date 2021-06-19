import express from 'express';
import authenticationRoutes from './routes/authentication-routes.js';

const app = express();

app.listen(3001, () => {
    console.log("Account Management API started listening on port 3001");
});

app.use('/account', authenticationRoutes);
