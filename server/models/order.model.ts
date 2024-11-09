import mongoose, { Document, Model, Schema } from "mongoose";

// Định nghĩa interface IOrder cho đơn hàng
export interface IOrder extends Document {
    courseId: string; // ID khóa học
    userId: string; // ID người dùng
    payment_info: object; // Thông tin thanh toán
}

// Định nghĩa schema cho đơn hàng
const orderSchema = new Schema<IOrder>(
    {
        courseId: {
            type: String,
            required: true // Kiểm tra bắt buộc
        },
        userId: {
            type: String,
            required: true // Kiểm tra bắt buộc
        },
        payment_info: {
            type: Object // Thông tin thanh toán có thể là bất kỳ đối tượng nào
        }
    },
    { timestamps: true } // Tự động thêm trường createdAt và updatedAt
);

// Tạo mô hình đơn hàng từ schema
const OrderModel: Model<IOrder> = mongoose.model("Order", orderSchema);

export default OrderModel;