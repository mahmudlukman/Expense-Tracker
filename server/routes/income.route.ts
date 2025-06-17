import express from "express";
import {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel,
} from "../controller/income.controller";
import { isAuthenticated } from "../middleware/auth";
const incomeRouter = express.Router();

incomeRouter.post("/add-income", isAuthenticated, addIncome);
incomeRouter.get("/get-incomes", isAuthenticated, getAllIncome);
incomeRouter.get("/downloadexcel", isAuthenticated, downloadIncomeExcel);
incomeRouter.delete("/delete-income/:id", isAuthenticated, deleteIncome);

export default incomeRouter;
