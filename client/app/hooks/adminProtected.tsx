import {redirect} from "next/navigation"; // Import hàm redirect từ Next.js để điều hướng trang
import {useSelector} from "react-redux";
import React from "react";  // Import hook useSelector từ Redux để truy xuất state

// Component AdminProtected kiểm tra quyền truy cập của người dùng
export default function AdminProtected({
                                           children
                                       }: {
    children: React.ReactNode; // Chứa các component con (children) cần bảo vệ
}) {
    // Lấy thông tin người dùng từ Redux store (state.auth)
    const {user} = useSelector((state: any) => state.auth);

    // Kiểm tra nếu người dùng đã đăng nhập
    if (user) {
        // Kiểm tra vai trò của người dùng
        const isAdmin = user?.role === "admin";

        // Nếu là admin, hiển thị children, ngược lại chuyển hướng về trang chủ
        return isAdmin ? children : redirect("/"); // Nếu không phải admin, điều hướng về trang chủ
    }
}