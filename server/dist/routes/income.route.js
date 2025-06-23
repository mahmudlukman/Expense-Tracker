"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const income_controller_1 = require("../controller/income.controller");
const auth_1 = require("../middleware/auth");
const incomeRouter = express_1.default.Router();
incomeRouter.post("/add-income", auth_1.isAuthenticated, income_controller_1.addIncome);
incomeRouter.get("/get-incomes", auth_1.isAuthenticated, income_controller_1.getAllIncome);
incomeRouter.get("/downloadexcel", auth_1.isAuthenticated, income_controller_1.downloadIncomeExcel);
incomeRouter.delete("/delete-income/:id", auth_1.isAuthenticated, income_controller_1.deleteIncome);
exports.default = incomeRouter;
