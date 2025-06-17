import express from "express";
import { isAuthenticated } from "../middleware/auth";
import {
  addExpense,
  deleteExpense,
  downloadExpenseExcel,
  getAllExpense,
} from "../controller/expense.controller";
const expenseRouter = express.Router();

expenseRouter.post("/add-expense", isAuthenticated, addExpense);
expenseRouter.get("/get-expenses", isAuthenticated, getAllExpense);
expenseRouter.get("/downloadexcel", isAuthenticated, downloadExpenseExcel);
expenseRouter.delete("/delete-expense/:id", isAuthenticated, deleteExpense);

export default expenseRouter;
