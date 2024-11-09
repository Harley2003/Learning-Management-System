import { Server as SocketIOServer } from "socket.io";
import http from "http";

// Hàm khởi tạo máy chủ Socket.IO với sự kiện thông báo
export const initSocketServer = (server: http.Server) => {
  const io = new SocketIOServer(server);

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Nghe sự kiện 'notification' từ phía frontend
    socket.on("notification", (data) => {
      if (data) {
        // Phát sự kiện 'newNotification' chứa dữ liệu thông báo đến tất cả các khách hàng (dashboard admin)
        io.emit("newNotification", data);
      }
    });

    // Xử lý khi người dùng ngắt kết nối
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};