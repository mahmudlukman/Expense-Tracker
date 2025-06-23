"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const dashboard_controller_1 = require("../controller/dashboard.controller");
const dashboardRouter = express_1.default.Router();
dashboardRouter.get("/dashboard", auth_1.isAuthenticated, dashboard_controller_1.getDashboardData);
exports.default = dashboardRouter;
