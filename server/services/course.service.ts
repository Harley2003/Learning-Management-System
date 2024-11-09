import {NextFunction, Response} from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import CourseModel from "../models/course.model";

/**
 * Tạo khóa học.
 *
 * @param data - Dữ liệu của khóa học mới.
 * @param res - Đối tượng phản hồi của Express.
 */
export const createCourse = CatchAsyncError(
    async (data: any, res: Response): Promise<void> => {
        // Sử dụng mô hình Course để tạo một khóa học mới với dữ liệu đã cho
        const course = await CourseModel.create(data);

        // Trả về phản hồi thành công với mã trạng thái 201 (Created)
        res.status(201).json({
            success: true,
            message: "Course created successfully", // Thông báo thành công
            course // Trả về thông tin khóa học đã tạo
        });
    }
);

/**
 * Lấy tất cả khóa học.
 *
 * @param res - Đối tượng phản hồi của Express.
 */
export const getAllCourseServices = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // Tìm tất cả khóa học và sắp xếp theo thời gian tạo giảm dần
        const courses = await CourseModel.find().sort({ createdAt: -1 });

        // Trả về phản hồi thành công với mã trạng thái 200 (OK)
        res.status(200).json({
            success: true,
            courses // Trả về danh sách các khóa học
        });
    }
);