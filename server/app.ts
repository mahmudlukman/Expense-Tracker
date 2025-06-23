import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import compression from "compression";
import helmet from "helmet";
import dotenv from "dotenv";
import limiter from "./utils/rateLimiter";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import incomeRouter from "./routes/income.route";
import expenseRouter from "./routes/expense.route";
import dashboardRouter from "./routes/dashboard.route";

export const app = express();
//config
dotenv.config();

//body parser

app.use(express.json({ limit: "50mb" }));

//cookie parser

app.use(cookieParser());

//cors=>cross origin resource sharing

app.use(
  cors({
    origin: [
      "https://codepence-expense-tracker.netlify.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// Enable response compression to reduce payload size and improve performance
app.use(
  compression({
    threshold: 1024, // Only compress responses larger than 1KB
  })
);

// Use Helmet to enhance security by setting various HTTP headers
app.use(helmet());

// Apply rate limiting middleware to prevent excessive requests and enhance security
app.use(limiter);

//routes
app.use(
  "/api/v1",
  authRouter,
  userRouter,
  incomeRouter,
  expenseRouter,
  dashboardRouter
);

//testing route
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

app.use(ErrorMiddleware);
