require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// Định nghĩa interface IUser cho người dùng
export interface IUser extends Document {
    name: string; // Tên người dùng
    email: string; // Địa chỉ email
    password: string; // Mật khẩu
    avatar: { // Thông tin avatar của người dùng
        public_id: string; // ID công khai của ảnh
        url: string; // Đường dẫn URL đến ảnh
    };
    role: string; // Vai trò của người dùng (user/admin)
    isVerified: boolean; // Kiểm tra trạng thái xác minh email
    isActivate: string; // Trạng thái kích hoạt
    courses: Array<{ courseId: string }>; // Danh sách khóa học của người dùng
    comparePassword: (password: string) => Promise<boolean>; // Hàm so sánh mật khẩu
    SignAccessToken: () => string; // Hàm ký token truy cập
    SignRefreshToken: () => string; // Hàm ký token làm mới
    createPasswordResetToken: () => string; // Hàm tạo token đặt lại mật khẩu
    passwordResetToken?: string; // Token đặt lại mật khẩu
    passwordResetExpires?: Date; // Thời gian hết hạn của token đặt lại mật khẩu
}

// Định nghĩa schema cho người dùng
const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"] // Kiểm tra bắt buộc
        },
        email: {
            type: String,
            required: [true, "Please enter your email"], // Kiểm tra bắt buộc
            unique: true // Địa chỉ email phải là duy nhất
        },
        password: {
            type: String,
            required: [true, "Please enter your password"], // Kiểm tra bắt buộc
            minLength: [8, "Password should be greater than 8 characters"], // Kiểm tra độ dài
            select: false // Không trả mật khẩu khi tìm kiếm người dùng
        },
        avatar: {
            public_id: String,
            url: String
        },
        role: {
            type: String,
            default: "user" // Vai trò mặc định là người dùng
        },
        isVerified: {
            type: Boolean,
            default: false // Mặc định không được xác minh
        },
        isActivate: {
            type: String,
            default: "activate" // Mặc định là kích hoạt
        },
        courses: [
            {
                courseId: String // ID khóa học
            }
        ],
        passwordResetToken: String, // Token đặt lại mật khẩu
        passwordResetExpires: Date // Thời gian hết hạn của token đặt lại mật khẩu
    },
    { timestamps: true } // Tự động thêm trường createdAt và updatedAt
);

// Hàm băm mật khẩu trước khi lưu
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) { // Chỉ băm nếu mật khẩu đã thay đổi
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10); // Băm mật khẩu với bcrypt
    next();
});

// Hàm ký token truy cập
userSchema.methods.SignAccessToken = function () {
    return jwt.sign(
        {
            id: this._id // Chứa ID người dùng
        },
        process.env.ACCESS_TOKEN || "", // Lấy khóa từ biến môi trường
        {
            expiresIn: "5m" // Thời gian hết hạn là 5 phút
        }
    );
};

// Hàm ký token làm mới
userSchema.methods.SignRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id // Chứa ID người dùng
        },
        process.env.REFRESH_TOKEN || "", // Lấy khóa từ biến môi trường
        {
            expiresIn: "3d" // Thời gian hết hạn là 3 ngày
        }
    );
};

// Hàm so sánh mật khẩu
userSchema.methods.comparePassword = async function (
    enteredPassword: string
): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password); // So sánh mật khẩu đã nhập với mật khẩu đã băm
};

// Hàm tạo token đặt lại mật khẩu
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex"); // Tạo token ngẫu nhiên

    this.passwordResetToken = crypto // Băm token ngẫu nhiên
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Thời gian hết hạn là 10 phút

    return resetToken; // Trả về token chưa băm
};

// Tạo mô hình người dùng từ schema
const UserModel: Model<IUser> = mongoose.model("User", userSchema);

export default UserModel;