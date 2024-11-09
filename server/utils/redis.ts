import Redis from "ioredis";
require("dotenv").config();

// Tạo client Redis
const redisClient = () => {
    // Kiểm tra xem biến môi trường REDIS_URL có tồn tại không
    if (process.env.REDIS_URL) {
        const redis = new Redis(process.env.REDIS_URL); // Tạo một kết nối Redis mới với URL từ biến môi trường
        console.log(`Redis connected`); // Ghi thông báo kết nối thành công
        return redis; // Trả về instance Redis đã kết nối
    }
    throw new Error("Redis connection failed"); // Ném lỗi nếu không thể kết nối
};

// Xuất instance Redis
export const redis = redisClient();