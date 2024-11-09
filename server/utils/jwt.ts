require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

// Giao diện cho các tùy chọn của token
interface ITokenOptions {
    expires: Date; // Thời gian hết hạn của cookie
    maxAge: number; // Thời gian tối đa sống của cookie (tính bằng mili giây)
    httpOnly: boolean; // Đặt cookie là chỉ HTTP
    sameSite: "lax" | "strict" | "none" | undefined; // Cấu hình cookie SameSite
    secure?: boolean; // Đặt cookie là bảo mật (chỉ gửi qua HTTPS)
}

// Phân tích các biến môi trường và tích hợp với giá trị mặc định
const accessTokenExpire = parseInt(
    process.env.ACCESS_TOKEN_EXPIRE || "300", // Thời gian hết hạn của access token (mặc định 300 giây)
    10
);

const refreshTokenExpire = parseInt(
    process.env.REFRESH_TOKEN_EXPIRE || "1200", // Thời gian hết hạn của refresh token (mặc định 1200 giây)
    10
);

// Tùy chọn cho cookie access token
export const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000), // Thời gian hết hạn - 5 giờ
    maxAge: accessTokenExpire * 60 * 60 * 1000, // Thời gian tối đa sống
    httpOnly: true, // Chỉ HTTP
    sameSite: "lax", // Cấu hình SameSite
    secure: true, // Bảo mật
};

// Tùy chọn cho cookie refresh token
export const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), // Thời gian hết hạn - 3 ngày
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000, // Thời gian tối đa sống
    httpOnly: true, // Chỉ HTTP
    sameSite: "lax", // Cấu hình SameSite
    secure: true // Bảo mật
};

// Hàm gửi token cho người dùng sau khi đăng nhập
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.SignAccessToken(); // Tạo access token cho người dùng
    const refreshToken = user.SignRefreshToken(); // Tạo refresh token cho người dùng

    // Tải phiên làm việc lên Redis
    redis.set(user._id as string, JSON.stringify(user) as any);

    // Chỉ đặt secure là true trong môi trường sản xuất
    if (process.env.NODE_ENV === "production") {
        accessTokenOptions.secure = true; // Bảo mật cookie access token
        refreshTokenOptions.secure = true; // Bảo mật cookie refresh token
    } else {
        accessTokenOptions.secure = false; // Không bảo mật trong môi trường phát triển
        refreshTokenOptions.secure = false; // Không bảo mật trong môi trường phát triển
    }

    // Đặt cookie cho access token và refresh token
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    // Trả về phản hồi cho người dùng
    res.status(statusCode).json({
        success: true,
        message: "Logged in successfully", // Thông báo đăng nhập thành công
        user, // Thông tin người dùng
        /*
        accessToken, // Access token được tạo
        refreshToken // Refresh token được tạo
        */
    });
};