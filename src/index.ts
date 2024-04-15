import { PrismaClient } from "@prisma/client";
import express, { Application } from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.route";
import parkingAreaRoutes from "./routes/parking-area.route";
import reservingRoutes from "./routes/reserving.route";

import cors from "cors";
import { IUser } from './interfaces/user.interface';

const prisma = new PrismaClient();
const app: Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

declare global {
	namespace Express {
		interface Request {
			user?: IUser;
		}
	}
}


app.use(bodyParser.json());

// app.use(cors({
// 	origin: ['http://example1.com', 'http://example2.com']
//   }));

app.use(cors({ origin: "*" }));

app.use(`/api/v1/users`, userRoutes);
app.use(`/api/v1/parking-area`, parkingAreaRoutes);
app.use(`/api/v1/reserving`, reservingRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, prisma };
