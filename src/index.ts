import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import cookieParser from "cookie-parser";

dotenv.config();

import { notFound, errorHandler } from "./utils/middleware.js";

import userRoutes from "./routes/users.js";
import authorRoutes from "./routes/authors.js";
import postRoutes from "./routes/posts.js";

const server: Application = express();
const PORT = process.env.PORT ?? 8080;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(cors());

server.use("^/$|/index(.html)?", (req, res) => {
  res.json({
    success: true,
    message: "This is a server hosted on vercel, OWAKANAMU?",
    routes: {
      authors: [
        {
          method: "GET",
          route: "/api/authors",
          description: "Fetch All authors. Pagination inclusive!",
        },
      ],
      users: [
        {
          method: "GET",
          route: "/api/users",
          description: "Fetch All users. Pagination inclusive!",
        },
      ],
      posts: [
        {
          method: "GET",
          route: "/api/posts",
          description: "Fetch All posts. Pagination inclusive!",
        },
      ],
    },
  });
});

server.use("/api/users/", userRoutes);
server.use("/api/authors/", authorRoutes);
server.use("/api/posts/", postRoutes);

server.use(notFound);
server.use(errorHandler);

server.listen(Number(PORT), () => console.log(`Server 🚀 on port ${PORT}!`));
