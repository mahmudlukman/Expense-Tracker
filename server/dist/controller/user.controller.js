"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUserById = exports.getLoggedInUser = void 0;
const User_model_1 = __importDefault(require("../model/User.model"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const cloudinary_1 = __importDefault(require("cloudinary"));
// @desc    Get logged in user profile
// @route   GET /api/v1/me
// @access  Private (Requires access token)
exports.getLoggedInUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const user = await User_model_1.default.findById(userId).select("-password");
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// @desc    Get user profile
// @route   GET /api/v1/user/:userId
// @access  Private
exports.getUserById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User_model_1.default.findById(userId).select("-password");
        if (!user) {
            return next(new errorHandler_1.default("User not found", 400));
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// @desc    Update user profile
// @route   GET /api/v1/update-user/
// @access  Private
exports.updateUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { name, avatar } = req.body;
        const userId = req.user?._id;
        const user = await User_model_1.default.findById(userId);
        if (!user) {
            return next(new errorHandler_1.default("User not found", 400));
        }
        if (name)
            user.name = name;
        if (avatar && avatar !== user.avatar?.url) {
            if (user.avatar?.public_id) {
                await cloudinary_1.default.v2.uploader.destroy(user.avatar.public_id);
            }
            const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
                folder: "avatar",
                width: 150,
            });
            user.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        await user.save();
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
