require("dotenv").config();
import { app } from "./app";
import { initSocketServer } from "./socketServer";
import connectDB from "./utils/db";
import { v2 as cloudinary } from "cloudinary";
import http from "http";

// Tạo một máy chủ HTTP sử dụng ứng dụng Express
const server = http.createServer(app);

// Định nghĩa số cổng để lắng nghe
const PORT = process.env.PORT || "";

// Khởi động máy chủ và kết nối đến cơ sở dữ liệu
server.listen(PORT, () => {
  console.log(`Server is connected with port ${PORT}`);
  connectDB(); // Kết nối đến cơ sở dữ liệu khi máy chủ khởi động
});

// Cấu hình Cloudinary với thông tin từ biến môi trường
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY
});

// Khởi tạo máy chủ Socket.IO
initSocketServer(server);