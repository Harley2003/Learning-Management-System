import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

/*
 * Middleware xử lý lỗi cho ứng dụng Express.
 * Hàm này sẽ nhận đối tượng lỗi và trả về phản hồi thích hợp cho client.
 */
export const ErrorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
  // Đặt mã trạng thái cho lỗi, mặc định là 500 (Lỗi máy chủ nội bộ)
  err.statusCode = err.statusCode || 500;
  // Đặt thông điệp lỗi mặc định
  err.message = err.message || "Internal server error";

  // Kiểm tra lỗi ID MongoDB không hợp lệ
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400); // Tạo lỗi mới với thông điệp tùy chỉnh và mã trạng thái 400
  }

  // Kiểm tra lỗi khóa trùng lặp
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400); // Tạo lỗi mới với thông điệp tùy chỉnh và mã trạng thái 400
  }

  // Kiểm tra lỗi JWT không hợp lệ
  if (err.code === "JsonWebTokenError") {
    const message = "nJson web token is invalid, try agai";
    err = new ErrorHandler(message, 400); // Tạo lỗi mới với thông điệp tùy chỉnh và mã trạng thái 400
  }

  // Kiểm tra lỗi JWT đã hết hạn
  if (err.code === "TokenExpiredError") {
    const message = "Json web token is expired, try again";
    err = new ErrorHandler(message, 400); // Tạo lỗi mới với thông điệp tùy chỉnh và mã trạng thái 400
  }

  // Gửi phản hồi lỗi về client với mã trạng thái và thông điệp lỗi
  res.status(err.statusCode).json({
    success: false,
    message: err.message
  });
};