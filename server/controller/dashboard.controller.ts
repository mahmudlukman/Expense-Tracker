import ErrorHandler from "../utils/errorHandler";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { NextFunction, Request, Response } from "express";
import Expense from "../model/Expense.model";
import Income from "../model/Income.model";
import { isValidObjectId, Types } from "mongoose";

// @desc    Delete an expense record
// @route   GET /api/v1/delete-expense/:id
// @access  Private (Requires access token)
export const getDashboardData = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const userObjectId = new Types.ObjectId(String(userId));

      // Fetch total income & expenses
      const totalIncome = await Income.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      console.log("totalIncome", {
        totalIncome,
        userId: isValidObjectId(userId),
      });

      const totalExpense = await Expense.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      // Get income transactions in the last 60 days
      const last60DaysIncomeTransactions = await Income.find({
        userId,
        date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
      }).sort({ date: -1 });

      // Get total income for last 60 days
      const incomeLast60Days = last60DaysIncomeTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );

      // Get expense transactions in the last 30 days
      const last30DaysExpenseTransactions = await Expense.find({
        userId,
        date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }).sort({ date: -1 });

      // Get total expenses for last 30 days
      const expensesLast30Days = last30DaysExpenseTransactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );

      // Fetch last 5 transactions (income + expenses)
      const lastTransactions = [
        ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
          (txn) => ({
            ...txn.toObject(),
            type: "income",
          })
        ),
        ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
          (txn) => ({
            ...txn.toObject(),
            type: "expense",
          })
        ),
      ].sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort latest first

      // Final Response
      res.status(200).json({
        success: true,
        totalBalance:
          (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
        totalIncome: totalIncome[0]?.total || 0,
        totalExpenses: totalExpense[0]?.total || 0,
        last30DaysExpenses: {
          total: expensesLast30Days,
          transactions: last30DaysExpenseTransactions,
        },
        last60DaysIncome: {
          total: incomeLast60Days,
          transactions: last60DaysIncomeTransactions,
        },
        recentTransactions: lastTransactions,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
