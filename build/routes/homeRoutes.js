"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const homeController_1 = __importDefault(require("../controllers/homeController"));
const router = express_1.default.Router();
router.route("/").get(homeController_1.default.getHomeResponse);
exports.default = router;
