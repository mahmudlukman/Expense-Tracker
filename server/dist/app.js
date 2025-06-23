"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middleware/error");
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const rateLimiter_1 = __importDefault(require("./utils/rateLimiter"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const income_route_1 = __importDefault(require("./routes/income.route"));
const expense_route_1 = __importDefault(require("./routes/expense.route"));
const dashboard_route_1 = __importDefault(require("./routes/dashboard.route"));
exports.app = (0, express_1.default)();
//config
dotenv_1.default.config();
//body parser
exports.app.use(express_1.default.json({ limit: "50mb" }));
//cookie parser
exports.app.use((0, cookie_parser_1.default)());
//cors=>cross origin resource sharing
exports.app.use((0, cors_1.default)({
    origin: [
        "https://codepence-expense-tracker.netlify.app",
        "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Enable response compression to reduce payload size and improve performance
exports.app.use((0, compression_1.default)({
    threshold: 1024, // Only compress responses larger than 1KB
}));
// Use Helmet to enhance security by setting various HTTP headers
exports.app.use((0, helmet_1.default)());
// Apply rate limiting middleware to prevent excessive requests and enhance security
exports.app.use(rateLimiter_1.default);
//routes
exports.app.use("/api/v1", auth_route_1.default, user_route_1.default, income_route_1.default, expense_route_1.default, dashboard_route_1.default);
//testing route
exports.app.get("/test", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "API is working",
    });
});
exports.app.use(error_1.ErrorMiddleware);
