import {useRouter} from "next/navigation"; // Import hook useRouter từ Next.js để điều hướng trang
import React, {useEffect} from "react"; // Import React và hook useEffect
import useAuth from "@/app/hooks/userAuth"; // Import custom hook useAuth để kiểm tra trạng thái đăng nhập

// Component Protected kiểm tra người dùng có được xác thực hay không
export default function Protected({children}: { children: React.ReactNode }) {
    // Sử dụng custom hook useAuth để lấy trạng thái xác thực của người dùng
    const isAuthenticated = useAuth();
    const router = useRouter(); // Lấy router từ Next.js để điều hướng trang

    useEffect(() => {
        // Kiểm tra nếu người dùng không xác thực, chuyển hướng về trang chủ
        if (!isAuthenticated) {
            router.push("/"); // Điều hướng về trang chủ nếu không được xác thực
        }
    }, [isAuthenticated, router]); // Phụ thuộc vào isAuthenticated và router

    // Nếu người dùng không xác thực, không render gì (trả về null)
    if (!isAuthenticated) return null;

    // Nếu người dùng đã xác thực, hiển thị các component con (children)
    return <>{children}</>;
}