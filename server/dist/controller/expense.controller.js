"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadExpenseExcel = exports.deleteExpense = exports.getAllExpense = exports.addExpense = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const xlsx_1 = __importDefault(require("xlsx"));
const Expense_model_1 = __importDefault(require("../model/Expense.model"));
// @desc    Add a new expense record
// @route   GET /api/v1/expense
// @access  Private (Requires access token)
exports.addExpense = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { icon, category, amount, date } = req.body;
        // Validation: Check for missing fields
        if (!category || !amount || !date) {
            return next(new errorHandler_1.default("All fields are required", 400));
        }
        const newExpense = new Expense_model_1.default({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });
        await newExpense.save();
        res.status(200).json({ success: true, newExpense });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// @desc    Get all expense records for a user
// @route   GET /api/v1/all-expense
// @access  Private (Requires access token)
exports.getAllExpense = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const expenses = await Expense_model_1.default.find({ userId }).sort({ date: -1 });
        res.status(200).json({ success: true, expenses });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// @desc    Delete an expense record
// @route   GET /api/v1/delete-expense/:id
// @access  Private (Requires access token)
exports.deleteExpense = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        await Expense_model_1.default.findByIdAndDelete(req.params.id);
        res
            .status(200)
            .json({ success: true, message: "Expense deleted successfully" });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// @desc    Download expense records as an Excel file
// @route   GET /api/v1/download-expense-excel/:id
// @access  Private (Requires access token)
exports.downloadExpenseExcel = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const expense = await Expense_model_1.default.find({ userId }).sort({ date: -1 });
        // Prepare data for Excel
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));
        const wb = xlsx_1.default.utils.book_new();
        const ws = xlsx_1.default.utils.json_to_sheet(data);
        xlsx_1.default.utils.book_append_sheet(wb, ws, "Expense");
        xlsx_1.default.writeFile(wb, "expense_details.xlsx");
        res.download("expense_details.xlsx");
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
