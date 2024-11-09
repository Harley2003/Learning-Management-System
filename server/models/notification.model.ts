import mongoose, { Document, Model, Schema } from "mongoose";

// Định nghĩa interface INotification cho thông báo
export interface INotification extends Document {
    title: string; // Tiêu đề thông báo
    message: string; // Nội dung thông báo
    status: string; // Trạng thái thông báo (đọc/chưa đọc)
}

// Định nghĩa schema cho thông báo
const notificationSchema = new Schema<INotification>(
    {
        title: {
            type: String,
            required: true // Tiêu đề là bắt buộc
        },
        message: {
            type: String,
            required: true // Nội dung là bắt buộc
        },
        status: {
            type: String,
            required: true, // Trạng thái là bắt buộc
            default: "unread" // Giá trị mặc định là "unread"
        },
    },
    { timestamps: true } // Tự động thêm trường createdAt và updatedAt
);

// Tạo mô hình Notification từ schema
const NotificationModel: Model<INotification> = mongoose.model(
    "Notification",
    notificationSchema
);

export default NotificationModel;