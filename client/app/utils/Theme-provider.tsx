import * as React from "react";
import {ThemeProvider as NextThemesProvider} from "next-themes"; // Import ThemeProvider từ next-themes để quản lý theme
import type {ThemeProviderProps} from "next-themes/dist/types"; // Import kiểu ThemeProviderProps từ next-themes để dùng cho props

// Định nghĩa component ThemeProvider để bao bọc theme và cấu hình các tùy chọn
export function ThemeProvider({children, ...props}: ThemeProviderProps) {
    return (
        <NextThemesProvider
            {...props} // Truyền tất cả các props khác vào NextThemesProvider
            storageKey="theme" // Đặt khóa lưu trữ theme trong localStorage
            defaultTheme="dark" // Theme mặc định là "dark"
            enableSystem={true} // Cho phép tự động thay đổi theo theme hệ thống
        >
            {children} {/* Hiển thị các component con */}
        </NextThemesProvider>
    );
}