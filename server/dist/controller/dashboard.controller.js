"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardData = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const Expense_model_1 = __importDefault(require("../model/Expense.model"));
const Income_model_1 = __importDefault(require("../model/Income.model"));
const mongoose_1 = require("mongoose");
// @desc    Delete an expense record
// @route   GET /api/v1/delete-expense/:id
// @access  Private (Requires access token)
exports.getDashboardData = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userObjectId = new mongoose_1.Types.ObjectId(String(userId));
        // Fetch total income & expenses
        const totalIncome = await Income_model_1.default.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        console.log("totalIncome", {
            totalIncome,
            userId: (0, mongoose_1.isValidObjectId)(userId),
        });
        const totalExpense = await Expense_model_1.default.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        // Get income transactions in the last 60 days
        const last60DaysIncomeTransactions = await Income_model_1.default.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });
        // Get total income for last 60 days
        const incomeLast60Days = last60DaysIncomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        // Get expense transactions in the last 30 days
        const last30DaysExpenseTransactions = await Expense_model_1.default.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });
        // Get total expenses for last 30 days
        const expensesLast30Days = last30DaysExpenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        // Fetch last 5 transactions (income + expenses)
        const lastTransactions = [
            ...(await Income_model_1.default.find({ userId }).sort({ date: -1 }).limit(5)).map((txn) => ({
                ...txn.toObject(),
                type: "income",
            })),
            ...(await Expense_model_1.default.find({ userId }).sort({ date: -1 }).limit(5)).map((txn) => ({
                ...txn.toObject(),
                type: "expense",
            })),
        ].sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort latest first
        // Final Response
        res.status(200).json({
            success: true,
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
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
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
