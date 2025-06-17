import ErrorHandler from "../utils/errorHandler";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { NextFunction, Request, Response } from "express";
import Income from "../model/Income.model";
import xlsx from "xlsx";

// @desc    Add a new income record
// @route   GET /api/v1/income
// @access  Private (Requires access token)
export const addIncome = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const { icon, source, amount, date } = req.body;

      // Validation: Check for missing fields
      if (!source || !amount || !date) {
        return next(new ErrorHandler("All fields are required", 400));
      }

      const newIncome = new Income({
        userId,
        icon,
        source,
        amount,
        date: new Date(date),
      });

      await newIncome.save();
      res.status(200).json({ success: true, newIncome });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// @desc    Get all income records for a user
// @route   GET /api/v1/all-income
// @access  Private (Requires access token)
export const getAllIncome = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const income = await Income.find({ userId }).sort({ date: -1 });
      res.status(200).json({ success: true, income });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// @desc    Delete an income record
// @route   GET /api/v1/delete-income
// @access  Private (Requires access token)
export const deleteIncome = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Income.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({ success: true, message: "Income deleted successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// @desc    Download income records as an Excel file
// @route   GET /api/v1/download-income-excel
// @access  Private (Requires access token)
export const downloadIncomeExcel = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const income = await Income.find({ userId }).sort({ date: -1 });

      // Prepare data for Excel
      const data = income.map((item) => ({
        Source: item.source,
        Amount: item.amount,
        Date: item.date,
      }));

      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(data);
      xlsx.utils.book_append_sheet(wb, ws, "Income");
      xlsx.writeFile(wb, "income_details.xlsx");
      res.download("income_details.xlsx");
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
