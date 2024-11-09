import React, {useState, useEffect} from "react";
import {useTheme} from "next-themes"; // Import hook useTheme từ next-themes để quản lý chế độ sáng/tối
import {BiSun, BiMoon} from "react-icons/bi"; // Import các icon mặt trời và mặt trăng từ react-icons

// Component chuyển đổi chế độ sáng/tối
const ThemeSwitcher = () => {
    // State để theo dõi khi component đã mount lên DOM
    const [mounted, setMounted] = useState(false);
    const {theme, setTheme} = useTheme(); // Lấy theme hiện tại và hàm để thay đổi theme từ useTheme hook

    // Sử dụng useEffect để đánh dấu khi component đã mount lên DOM
    useEffect(() => {
        setMounted(true);
    }, []);

    // Kiểm tra nếu chưa mount xong thì không hiển thị component
    if (!mounted) return null;

    // Trả về các icon chuyển đổi chế độ sáng/tối tùy theo theme hiện tại
    return (
        <div className="flex items-center justify-center mx-4">
            {theme === "light" ? (
                <BiMoon
                    className="cursor-pointer" // Thêm kiểu con trỏ để biểu thị là có thể nhấn
                    fill="black"
                    size={25} // Kích thước của icon
                    onClick={() => setTheme("dark")} // Chuyển sang theme "dark" khi nhấn vào
                />
            ) : (
                <BiSun
                    className="cursor-pointer"
                    size={25}
                    onClick={() => setTheme("light")} // Chuyển sang theme "light" khi nhấn vào
                />
            )}
        </div>
    );
};

export default ThemeSwitcher;