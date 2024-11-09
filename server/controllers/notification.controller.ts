import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import NotificationModel from "../models/notification.model";
import cron from "node-cron";

/*
* - Các chức năng thông báo phía Admin
*
* + Get All Notifications
* + Update Notification Status
* + Delete Notification
*/

/**
 * Lấy tất cả thông báo.
 *
 * @param req - Đối tượng yêu cầu từ client.
 * @param res - Đối tượng phản hồi của Express.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const getNotifications = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Tìm tất cả thông báo và sắp xếp theo thời gian tạo giảm dần
        const notifications = await NotificationModel.find().sort({
          createdAt: -1
        });

        // Trả về phản hồi thành công với danh sách thông báo
        res.status(200).json({
          success: true,
          message: "Notifications fetched successfully",
          notifications
        });
      } catch (error: any) {
        // Xử lý lỗi và gọi hàm tiếp theo với thông báo lỗi
        return next(new ErrorHandler(error.message, 500));
      }
    }
);

/**
 * Cập nhật trạng thái của một thông báo.
 *
 * @param req - Đối tượng yêu cầu từ client (bao gồm ID thông báo).
 * @param res - Đối tượng phản hồi của Express.
 * @param next - Hàm gọi tiếp theo để xử lý lỗi.
 */
export const updateNotification = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Tìm thông báo theo ID từ tham số URL
        const notification = await NotificationModel.findById(req.params.id);

        // Kiểm tra xem thông báo có tồn tại hay không
        if (!notification) {
          return next(new ErrorHandler("Notification not found", 404));
        } else {
          // Cập nhật trạng thái thông báo thành "read" nếu nó chưa được đọc
          notification.status = "read";
        }

        // Lưu thông báo đã cập nhật
        await notification.save();

        // Lấy lại danh sách tất cả thông báo sau khi cập nhật
        const notifications = await NotificationModel.find().sort({
          createdAt: -1
        });

        // Trả về phản hồi thành công với danh sách thông báo
        res.status(200).json({
          success: true,
          message: "Notification updated successfully",
          notifications
        });
      } catch (error: any) {
        // Xử lý lỗi và gọi hàm tiếp theo với thông báo lỗi
        return next(new ErrorHandler(error.message, 500));
      }
    }
);

// Tạo một lịch trình để xóa thông báo đã đọc sau 30 ngày
cron.schedule("0 0 0 * * *", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await NotificationModel.deleteMany({
    status: "read",
    createdAt: { $lt: thirtyDaysAgo }
  });
});