import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/users";
import { notFound, errorHandler } from "./utils/middleware";

const server = express();
const PORT = process.env.PORT || 8500;

server.use(cookieParser());
server.use(express.json());
server.use(cors({ credentials: false }));

if (process.env.NODE_ENV === "development") {
  server.use(morgan("dev"));
}

server.use("/api/users", userRoutes);

server.use(notFound);
server.use(errorHandler);

server.listen(Number(PORT), () =>
  console.log(`Server running on port ${PORT}!`)
);
