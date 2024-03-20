"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const notFound = (0, express_async_handler_1.default)(async (req, res, next) => {
    res.status(404);
    throw new Error(`Route not found - ${req.originalUrl}`);
});
exports.notFound = notFound;
async function errorHandler(err, req, res, next) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const message = err.message;
    const stack = process.env.NODE_ENV === "development" ? err.stack : "";
    res.status(statusCode).json({
        message,
        stack,
    });
}
exports.errorHandler = errorHandler;
