import mongoose from "mongoose";
require("dotenv").config();

const dbURL: string = process.env.DB_URL || ""; // Lấy URL của cơ sở dữ liệu từ biến môi trường

/*
 * Hàm connectDB để kết nối đến cơ sở dữ liệu MongoDB
 * Hàm này sử dụng async/await để thực hiện kết nối bất đồng bộ
 */
const connectDB = async () => {
  try {
    // Kết nối đến cơ sở dữ liệu bằng mongoose
    await mongoose.connect(dbURL).then((data: any) => {
      // In ra thông tin kết nối thành công
      console.log(`Database connected with ${data.connection.host}`);
    });
  } catch (error: any) {
    // Nếu có lỗi xảy ra, in ra thông báo lỗi
    console.log(error.message);
    // Thử lại kết nối sau 5 giây nếu kết nối thất bại
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;