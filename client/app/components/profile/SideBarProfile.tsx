import Image from "next/image";
import React, { FC } from "react";
import avatarDefault from "@/public/assests/avatar.png"; // Avatar mặc định
import { RiLockPasswordLine } from "react-icons/ri"; // Icon đổi mật khẩu
import { SiCoursera } from "react-icons/si"; // Icon khóa học
import { AiOutlineLogout } from "react-icons/ai"; // Icon đăng xuất
import { MdOutlineAdminPanelSettings } from "react-icons/md"; // Icon bảng điều khiển quản trị
import Link from "next/link"; // Link để chuyển hướng trang

type Props = {
    user: any;
    active: number;
    avatar: string | null;
    setActive: (active: number) => void;
    logOutHandler: any;
};

const SideBarProfile: FC<Props> = ({
                                       user,
                                       active,
                                       avatar,
                                       setActive,
                                       logOutHandler
                                   }) => {
    return (
        <div className="w-full">
            {/* My Account Section */}
            <div
                className={`w-full flex items-center px-3 py-4 cursor-pointer ${
                    active === 1 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
                }`}
                onClick={() => setActive(1)} // Chọn tab My Account
            >
                <Image
                    priority
                    src={
                        user?.avatar || avatar ? user?.avatar?.url || avatar : avatarDefault // Hiển thị avatar người dùng
                    }
                    alt=""
                    width={20}
                    height={20}
                    className="w-[20px] h-[20px] 800px:h-[30px] 800px:w-[30px] cursor-pointer rounded-full"
                    style={{ border: "2px solid #37a39a" }} // Border màu xanh lá
                />
                <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
                    My Account
                </h5>
            </div>

            {/* Change Password Section */}
            {user?.role !== "admin" && (
                <>
                    <div
                        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
                            active === 2 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
                        }`}
                        onClick={() => setActive(2)} // Chọn tab Change Password
                    >
                        <RiLockPasswordLine size={20} className="dark:text-white text-black" />
                        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
                            Change Password
                        </h5>
                    </div>

                    {/* Enrolled Courses Section */}
                    <div
                        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
                            active === 3 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
                        }`}
                        onClick={() => setActive(3)} // Chọn tab Enrolled Courses
                    >
                        <SiCoursera size={20} className="dark:text-white text-black" />
                        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
                            Enrolled Courses
                        </h5>
                    </div>
                </>
            )}

            {/* Admin Section (if the user is an admin) */}
            {user?.role === "admin" && (
                <Link
                    href="/admin"
                    className={`w-full flex items-center px-3 py-4 cursor-pointer ${
                        active === 6 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
                    }`}
                >
                    <MdOutlineAdminPanelSettings size={20} className="dark:text-white text-black" />
                    <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
                        Admin Dashboard
                    </h5>
                </Link>
            )}

            {/* Logout Section */}
            <div
                className="w-full flex items-center px-3 py-4 cursor-pointer"
                onClick={logOutHandler} // Đăng xuất người dùng
            >
                <AiOutlineLogout size={20} className="dark:text-white text-black" />
                <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
                    Logout
                </h5>
            </div>
        </div>
    );
};

export default SideBarProfile;