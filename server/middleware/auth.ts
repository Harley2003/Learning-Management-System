import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "./catchAsyncErrors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import { updateAccessToken } from "../controllers/user.controller";

// Middleware để xác thực người dùng đã đăng nhập
/*
export const isAuthenticated = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        // Lấy access token từ cookie
        const access_token = req.cookies.access_token as string;

        // Kiểm tra xem access token có tồn tại không
        if (!access_token) {
            return next(
                new ErrorHandler("Your session has expired. Please log in again.", 400) // Nếu không có token, trả về lỗi yêu cầu đăng nhập
            );
        }

        // Giải mã access token để lấy thông tin người dùng
        const decoded = jwt.decode(access_token) as JwtPayload;

        // Kiểm tra xem token có hợp lệ không
        if (!decoded) {
            return next(new ErrorHandler("Access token is not valid", 400)); // Nếu không hợp lệ, trả về lỗi
        }

        // Kiểm tra xem access token đã hết hạn chưa
        if (decoded.exp && decoded.exp <= Date.now() / 1000) {
            try {
                // Cập nhật access token nếu đã hết hạn
                updateAccessToken(req, res, next);
            } catch (error: any) {
                return next(error); // Nếu có lỗi trong quá trình cập nhật, truyền lỗi cho middleware tiếp theo
            }
        } else {
            // Kiểm tra xem người dùng có tồn tại trong Redis không
            const user = await redis.get(decoded.id);

            // Nếu không tìm thấy người dùng, yêu cầu đăng nhập
            if (!user) {
                return next(
                    new ErrorHandler("Please login to access this resource", 400)
                );
            }

            // Gán thông tin người dùng vào đối tượng req
            req.user = JSON.parse(user);

            next(); // Tiếp tục đến middleware tiếp theo
        }
    }
);
*/
export const isAuthenticated = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        // Lấy access token và refresh token từ cookie
        const access_token = req.cookies.access_token as string;
        const refresh_token = req.cookies.refresh_token as string;

        // Nếu access token không tồn tại, kiểm tra refresh token
        if (!access_token) {
            if (refresh_token) {
                // Thử cập nhật access token bằng refresh token
                return updateAccessToken(req, res, next);
            } else {
                return next(new ErrorHandler("Your session has expired. Please log in again.", 400));
            }
        }

        // Giải mã access token để lấy thông tin người dùng
        const decoded = jwt.decode(access_token) as JwtPayload;

        // Kiểm tra nếu access token đã hết hạn
        if (decoded?.exp && decoded.exp <= Date.now() / 1000) {
            if (refresh_token) {
                return updateAccessToken(req, res, next); // Dùng refresh token để cập nhật access token
            } else {
                return next(new ErrorHandler("Your session has expired. Please log in again.", 400));
            }
        }

        // Kiểm tra người dùng trong Redis
        const user = await redis.get(decoded.id);
        if (!user) {
            return next(new ErrorHandler("Please login to access this resource", 400));
        }

        // Gán thông tin người dùng vào req
        req.user = JSON.parse(user);
        next();
    }
);

// Middleware để xác thực vai trò người dùng
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Kiểm tra xem vai trò của người dùng có nằm trong danh sách vai trò cho phép không
        if (!roles.includes(req.user?.role || "")) {
            return next(
                new ErrorHandler(
                    `Role (${req.user?.role}) is not allowed to access this resource`,
                    403 // Nếu không, trả về lỗi 403 (cấm truy cập)
                )
            );
        }
        next(); // Nếu hợp lệ, tiếp tục đến middleware tiếp theo
    };
};