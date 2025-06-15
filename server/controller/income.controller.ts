import User from "../model/User.model";
import ErrorHandler from "../utils/errorHandler";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { NextFunction, Request, Response } from "express";
import Income from "../model/Income.model";

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
        return res.status(400).json({ message: "All fields are required" });
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
      const userId = req.user?._id;
      await Income.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({ success: true, message: "Income deleted successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
