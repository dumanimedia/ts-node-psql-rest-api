import express from "express";
import dotenv from "dotenv";

dotenv.config();

import HomeRoutes from "./routes/homeRoutes";
import { errorHandler, notFound } from "./utils/middleware";

const server = express();
const PORT = process.env.PORT ?? 8000;

server.use("/", HomeRoutes);

server.use(notFound);
server.use(errorHandler);

server.listen(Number(PORT), (): void =>
  console.log(`Server is running on ${PORT}!`)
);
