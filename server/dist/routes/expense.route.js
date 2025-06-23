"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const expense_controller_1 = require("../controller/expense.controller");
const expenseRouter = express_1.default.Router();
expenseRouter.post("/add-expense", auth_1.isAuthenticated, expense_controller_1.addExpense);
expenseRouter.get("/get-expenses", auth_1.isAuthenticated, expense_controller_1.getAllExpense);
expenseRouter.get("/downloadexcel", auth_1.isAuthenticated, expense_controller_1.downloadExpenseExcel);
expenseRouter.delete("/delete-expense/:id", auth_1.isAuthenticated, expense_controller_1.deleteExpense);
exports.default = expenseRouter;
