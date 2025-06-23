"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const User_model_1 = __importDefault(require("../model/User.model"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const jwt_1 = require("../utils/jwt");
const cloudinary_1 = __importDefault(require("cloudinary"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// @desc    Register a new user
// @route   POST /api/v1/register
// @access  Public
exports.registerUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { name, email, password, avatar } = req.body;
        const isEmailExist = await User_model_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new errorHandler_1.default("Email already exist", 400));
        }
        // Create user data object with required fields
        const userData = {
            name,
            email,
            password,
        };
        // Only handle avatar if it's provided
        if (avatar) {
            const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
                folder: "avatars",
            });
            // Add avatar details to user data
            userData.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        // Create the user with the prepared data
        const user = await User_model_1.default.create(userData);
        // Send JWT token in response
        (0, jwt_1.sendToken)(user, 201, res);
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// @desc    Login user
// @route   POST /api/v1/login
// @access  Public
exports.loginUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new errorHandler_1.default("Please enter email and password", 400));
        }
        const user = await User_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            return next(new errorHandler_1.default("Invalid credentials", 400));
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new errorHandler_1.default("Invalid credentials", 400));
        }
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// @desc    Logout user
// @route   POST /api/v1/logout
// @access  Public
exports.logoutUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        res.cookie("access_token", "", {
            maxAge: 1,
        });
        res
            .status(200)
            .json({ success: true, message: "Logged out successfully" });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
