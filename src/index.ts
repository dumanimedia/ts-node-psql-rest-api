import "dotenv/config";
import morgan from "morgan";
import express from "express";
import cookieParser from "cookie-parser";

import homeRouter from "./routes/home";
import { errorHandler, notFound } from "./utils/middleware";

const server = express();
const PORT = process.env.PORT || 8000;

server.use(cookieParser());
server.use(express.json());

if (process.env.NODE_ENV === "development") {
  server.use(morgan("dev"));
}

server.use("/", homeRouter);

server.use(notFound);
server.use(errorHandler);

server.listen(Number(PORT), () => console.log(`Server running on ${PORT}!`));
