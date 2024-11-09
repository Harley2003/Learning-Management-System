import { NextFunction, Response } from "express";
import OrderModel from "../models/order.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";

/**
 * Tạo đơn hàng mới.
 *
 * @param data - Dữ liệu của đơn hàng mới.
 * @param res - Đối tượng phản hồi của Express.
 */
export const newOrder = CatchAsyncError(
    async (data: any, res: Response): Promise<void> => {
        // Sử dụng mô hình Order để tạo một đơn hàng mới với dữ liệu đã cho
        const order = await OrderModel.create(data);

        // Trả về phản hồi thành công với mã trạng thái 201 (Created)
        res.status(201).json({
            success: true,
            order // Trả về thông tin đơn hàng đã tạo
        });
    }
);

/**
 * Lấy tất cả đơn hàng.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi của Express.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const getAllOrderServices = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // Tìm tất cả đơn hàng và sắp xếp theo thời gian tạo giảm dần
        const orders = await OrderModel.find().sort({ createdAt: -1 });

        // Trả về phản hồi thành công với mã trạng thái 200 (OK)
        res.status(200).json({
            success: true,
            orders // Trả về danh sách các đơn hàng
        });
    }
);