

import { PrismaClient } from '@prisma/client';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './src/routes/user.route';
const prisma = new PrismaClient();
const app: Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;


app.use(bodyParser.json());

app.use(`/api/v1/users`, userRoutes);

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});

export { app, prisma };