"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const homeRoutes_1 = __importDefault(require("./routes/homeRoutes"));
const middleware_1 = require("./utils/middleware");
const server = (0, express_1.default)();
const PORT = process.env.PORT ?? 8000;
server.use("/", homeRoutes_1.default);
server.use(middleware_1.notFound);
server.use(middleware_1.errorHandler);
server.listen(Number(PORT), () => console.log(`Server is running on ${PORT}!`));
