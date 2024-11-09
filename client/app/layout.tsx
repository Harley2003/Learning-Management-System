"use client";

// Import các font từ Google để sử dụng trong ứng dụng
import {Poppins} from "next/font/google";
import {Josefin_Sans} from "next/font/google";
import {Pacifico} from "next/font/google";

// Import file CSS toàn cục
import "./globals.css";

// Import các providers và tiện ích cần thiết
import {ThemeProvider} from "./utils/Theme-provider";
import {Providers} from "./Provider";
import React, {useEffect, useState} from "react";
import {Toaster} from "react-hot-toast";

// Import socket.io để tạo kết nối WebSocket
import socketIO from "socket.io-client";

// Import component loader để hiển thị trạng thái đang tải
import Loader from "@/app/components/Loader/Loader";

// Đặt URI của server WebSocket từ biến môi trường
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";

// Cấu hình các font từ Google với các trọng lượng cụ thể và biến CSS
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-Poppins"
});

const josefin = Josefin_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-Josefin"
});

const cursive = Pacifico({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-Cursive"
});

// Định nghĩa component RootLayout bao bọc cấu trúc chính của ứng dụng
export default function RootLayout({
                                       children
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            // Áp dụng các biến font và class cho chế độ sáng/tối
            className={`${poppins.variable} ${josefin.variable} ${cursive.variable} bg-white dark:bg-gray-900 duration-300 transition-colors`}
        >
        <Providers>
            {/* ThemeProvider quản lý chủ đề (sáng/tối/hệ thống) */}
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {/* SocketProvider quản lý kết nối WebSocket và trạng thái loading */}
                <SocketProvider>
                    {children}
                </SocketProvider>
                {/* Toaster hiển thị các thông báo (toast) */}
                <Toaster position="top-center" reverseOrder={false}/>
            </ThemeProvider>
        </Providers>
        </body>
        </html>
    );
}

// Định nghĩa component SocketProvider để quản lý kết nối WebSocket
const SocketProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Chỉ chạy trên client và nếu endpoint WebSocket được thiết lập
        if (typeof window === "undefined" || !ENDPOINT) {
            console.warn("Endpoint WebSocket chưa được thiết lập hoặc đang chạy phía server.");
            setLoading(false); // Tắt trạng thái loading nếu WebSocket không khả dụng
            return;
        }

        // Khởi tạo kết nối socket sử dụng WebSocket transport
        const socket = socketIO(ENDPOINT, {transports: ["websocket"]});

        // Hàm xử lý khi kết nối thành công
        const handleConnect = () => {
            console.log("Đã kết nối với server socket");
            setLoading(false); // Tắt trạng thái loading khi kết nối thành công
        };

        // Hàm xử lý khi gặp lỗi kết nối
        const handleConnectError = (error: Error) => {
            console.error("Lỗi kết nối socket:", error);
            setLoading(false); // Tắt trạng thái loading khi gặp lỗi
        };

        // Thiết lập lắng nghe sự kiện connect và lỗi kết nối
        socket.on("connect", handleConnect);
        socket.on("connect_error", handleConnectError);

        // Phần dọn dẹp có thể kích hoạt lại nếu cần xử lý tái kết nối hoặc dọn dẹp
        // return () => {
        //     socket.off("connect", handleConnect);
        //     socket.off("connect_error", handleConnectError);
        //     socket.disconnect();
        //     console.log("Đã ngắt kết nối với server socket");
        // };
    }, []);

    // Hiển thị loader cho đến khi kết nối thành công, sau đó hiển thị nội dung con
    return <div>{loading ? <Loader/> : children}</div>;
};