"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadIncomeExcel = exports.deleteIncome = exports.getAllIncome = exports.addIncome = void 0;
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const Income_model_1 = __importDefault(require("../model/Income.model"));
const xlsx_1 = __importDefault(require("xlsx"));
// @desc    Add a new income record
// @route   GET /api/v1/income
// @access  Private (Requires access token)
exports.addIncome = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { icon, source, amount, date } = req.body;
        // Validation: Check for missing fields
        if (!source || !amount || !date) {
            return next(new errorHandler_1.default("All fields are required", 400));
        }
        const newIncome = new Income_model_1.default({
            userId,
            icon,
            source,
            amount,
            date: new Date(date),
        });
        await newIncome.save();
        res.status(200).json({ success: true, newIncome });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// @desc    Get all income records for a user
// @route   GET /api/v1/all-income
// @access  Private (Requires access token)
exports.getAllIncome = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const income = await Income_model_1.default.find({ userId }).sort({ date: -1 });
        res.status(200).json({ success: true, income });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// @desc    Delete an income record
// @route   GET /api/v1/delete-income
// @access  Private (Requires access token)
exports.deleteIncome = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        await Income_model_1.default.findByIdAndDelete(req.params.id);
        res
            .status(200)
            .json({ success: true, message: "Income deleted successfully" });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// @desc    Download income records as an Excel file
// @route   GET /api/v1/download-income-excel
// @access  Private (Requires access token)
exports.downloadIncomeExcel = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const income = await Income_model_1.default.find({ userId }).sort({ date: -1 });
        // Prepare data for Excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));
        const wb = xlsx_1.default.utils.book_new();
        const ws = xlsx_1.default.utils.json_to_sheet(data);
        xlsx_1.default.utils.book_append_sheet(wb, ws, "Income");
        xlsx_1.default.writeFile(wb, "income_details.xlsx");
        res.download("income_details.xlsx");
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
