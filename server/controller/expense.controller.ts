import ErrorHandler from "../utils/errorHandler";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { NextFunction, Request, Response } from "express";
import Income from "../model/Income.model";
import xlsx from "xlsx";
import Expense from "../model/Expense.model";

// @desc    Add a new expense record
// @route   GET /api/v1/expense
// @access  Private (Requires access token)
export const addExpense = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const { icon, category, amount, date } = req.body;

      // Validation: Check for missing fields
      if (!category || !amount || !date) {
        return next(new ErrorHandler("All fields are required", 400));
      }

      const newExpense = new Expense({
        userId,
        icon,
        category,
        amount,
        date: new Date(date),
      });

      await newExpense.save();
      res.status(200).json({ success: true, newExpense });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// @desc    Get all expense records for a user
// @route   GET /api/v1/all-expense
// @access  Private (Requires access token)
export const getAllExpense = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const expenses = await Expense.find({ userId }).sort({ date: -1 });
      res.status(200).json({ success: true, expenses });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// @desc    Delete an expense record
// @route   GET /api/v1/delete-expense/:id
// @access  Private (Requires access token)
export const deleteExpense = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Expense.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({ success: true, message: "Expense deleted successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// @desc    Download expense records as an Excel file
// @route   GET /api/v1/download-expense-excel/:id
// @access  Private (Requires access token)
export const downloadExpenseExcel = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const expense = await Expense.find({ userId }).sort({ date: -1 });

      // Prepare data for Excel
      const data = expense.map((item) => ({
        Category: item.category,
        Amount: item.amount,
        Date: item.date,
      }));

      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(data);
      xlsx.utils.book_append_sheet(wb, ws, "Expense");
      xlsx.writeFile(wb, "expense_details.xlsx");
      res.download("expense_details.xlsx");
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
