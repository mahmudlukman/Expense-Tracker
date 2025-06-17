import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { getDashboardData } from "../controller/dashboard.controller";

const dashboardRouter = express.Router();

dashboardRouter.get("/dashboard", isAuthenticated, getDashboardData);

export default dashboardRouter;
