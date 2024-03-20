"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const getHomeResponse = (0, express_async_handler_1.default)(async (req, res) => {
    res.json({
        success: true,
        message: "This is the get route's Response on the home route",
    });
});
exports.default = {
    getHomeResponse,
};
