import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import OrderModel from "../models/order.model";
import CourseModel from "../models/course.model";
import UserModel from "../models/user.model";

/*
* - Các chức năng thống kê phía Admin
*
* + Get Users Analytics
* + Get Courses Analytics
* + Get Order Analytics
*/

/**
 * Lấy phân tích dữ liệu người dùng trong 12 tháng qua.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi của Express.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const getUsersAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Gọi hàm để tạo dữ liệu phân tích người dùng trong 12 tháng qua
            const users = await generateLast12MonthsData(UserModel);

            // Trả về phản hồi thành công với dữ liệu người dùng
            res.status(200).json({
                success: true,
                users
            });
        } catch (error: any) {
            // Xử lý lỗi và gọi hàm tiếp theo với thông báo lỗi
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

/**
 * Lấy phân tích dữ liệu khóa học trong 12 tháng qua.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi của Express.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const getCoursesAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Gọi hàm để tạo dữ liệu phân tích khóa học trong 12 tháng qua
            const courses = await generateLast12MonthsData(CourseModel);

            // Trả về phản hồi thành công với dữ liệu khóa học
            res.status(200).json({
                success: true,
                courses
            });
        } catch (error: any) {
            // Xử lý lỗi và gọi hàm tiếp theo với thông báo lỗi
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

/**
 * Lấy phân tích dữ liệu đơn hàng trong 12 tháng qua.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi của Express.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const getOrderAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Gọi hàm để tạo dữ liệu phân tích đơn hàng trong 12 tháng qua
            const orders = await generateLast12MonthsData(OrderModel);

            // Trả về phản hồi thành công với dữ liệu đơn hàng
            res.status(200).json({
                success: true,
                orders
            });
        } catch (error: any) {
            // Xử lý lỗi và gọi hàm tiếp theo với thông báo lỗi
            return next(new ErrorHandler(error.message, 500));
        }
    }
);