require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();

import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";

// Import các route
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";

// Cấu hình body parser để giới hạn kích thước request body
app.use(express.json({ limit: "50mb" }));

// Cấu hình cookie parser để xử lý cookie từ client
app.use(cookieParser());

// CORS để chia sẻ tài nguyên giữa các nguồn gốc khác nhau
app.use(
    cors({
        origin: ["http://localhost:3000"], // Cho phép từ nguồn gốc cụ thể
        credentials: true
    })
);

// Định tuyến các route API
app.use(
    "/api/v1",
    userRouter,
    courseRouter,
    orderRouter,
    notificationRouter,
    analyticsRouter,
    layoutRouter
);

// Route test để kiểm tra hoạt động của API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "API is working"
    });
});

// Xử lý các route không tồn tại
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err); // Chuyển tiếp lỗi để xử lý trong ErrorMiddleware
});

// Middleware xử lý lỗi
app.use(ErrorMiddleware);