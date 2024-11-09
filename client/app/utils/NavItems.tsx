import Link from "next/link"; // Import component Link từ Next.js để tạo các liên kết điều hướng
import React from "react";

// Danh sách các mục điều hướng (navigation items)
export const ListNavItems = [
    {
        name: "Home", // Tên hiển thị
        url: "/" // URL liên kết
    },
    {
        name: "Courses",
        url: "/courses"
    },
    {
        name: "About",
        url: "/about"
    },
    {
        name: "Policy",
        url: "/policy"
    },
    {
        name: "FAQ",
        url: "/faq"
    }
];

// Định nghĩa kiểu Props cho component NavItems
type Props = {
    activeItem: number; // Chỉ mục của mục điều hướng đang được chọn
    isMobile: boolean; // Xác định nếu hiển thị trên thiết bị di động
};

// Component NavItems để hiển thị các mục điều hướng
const NavItems: React.FC<Props> = ({activeItem, isMobile}) => {
    return (
        <>
            {/* Hiển thị các mục điều hướng cho màn hình lớn (>=800px) */}
            <div className="hidden 800px:flex">
                {ListNavItems &&
                    ListNavItems.map((item, index) => (
                        <Link key={index} href={item.url} passHref>
              <span
                  className={`${
                      activeItem === index
                          ? "dark:text-[#37a39a] text-[crimson]" // Đổi màu nếu là mục đang hoạt động
                          : "dark:text-white text-black" // Màu mặc định cho các mục không hoạt động
                  } text-[18px] px-6 font-Poppins font-[400]`}
              >
                {item.name} {/* Hiển thị tên mục điều hướng */}
              </span>
                        </Link>
                    ))}
            </div>

            {/* Hiển thị các mục điều hướng cho thiết bị di động (<800px) */}
            {isMobile && (
                <div className="800px:hidden mt-5">
                    {/* Hiển thị tên trang hoặc tiêu đề ở trên cùng của menu di động */}
                    <div className="w-full text-center py-6">
                        <Link href="/" passHref>
                            {/*<span*/} {/* Mục tiêu đề (có thể dùng để hiển thị tên trang) */}
                            {/*  className={`text-[25px] font-Poppins font-[500] dark:text-white text-black`}*/}
                            {/*>*/}
                            {/*  ELearning*/}
                            {/*</span>*/}
                        </Link>
                    </div>
                    {/* Duyệt qua ListNavItems để hiển thị các mục điều hướng cho di động */}
                    {ListNavItems &&
                        ListNavItems.map((item, index) => (
                            <Link key={index} href={item.url} passHref>
                <span
                    className={`${
                        activeItem === index
                            ? "dark:text-[#37a39a] text-[crimson]" // Đổi màu nếu là mục đang hoạt động
                            : "dark:text-white text-black" // Màu mặc định cho các mục không hoạt động
                    } block py-5 text-[18px] px-6 font-Poppins font-[400]`}
                >
                  {item.name} {/* Hiển thị tên mục điều hướng */}
                </span>
                            </Link>
                        ))}
                </div>
            )}
        </>
    );
};

export default NavItems;