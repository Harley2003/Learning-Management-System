import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import avatarDefault from "@/public/assests/avatar.png";
import NavItems from "../utils/NavItems";
import CustomModal from "../utils/CustomModal";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Verification from "./Auth/Verification";
import { useSelector } from "react-redux";
import ForgetPassword from "@/app/components/Auth/ForgetPassword";
import ResetPassword from "@/app/components/Auth/ResetPassword";

type Props = {
    open: boolean;  // Kiểm tra trạng thái modal (mở/đóng)
    setOpen: (open: boolean) => void;  // Hàm để thay đổi trạng thái modal
    activeItem: number;  // Mục đang được chọn trong menu
    route: string;  // Đường dẫn hiện tại
    setRoute: (route: string) => void;  // Hàm để thay đổi đường dẫn hiện tại
};

const Header: FC<Props> = ({ open, setOpen, activeItem, route, setRoute }) => {
    const [active, setActive] = useState(false);  // Trạng thái cho header, khi scroll
    const [openSidebar, setOpenSidebar] = useState(false);  // Trạng thái sidebar mobile
    const { user } = useSelector((state: any) => state.auth);  // Lấy thông tin user từ Redux store

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 85) {  // Nếu người dùng cuộn xuống hơn 85px
                setActive(true);  // Đặt trạng thái active cho header
            } else {
                setActive(false);  // Đặt trạng thái inactive nếu cuộn lên
            }
        };

        const handleResize = () => {
            if (window.innerWidth >= 799) {  // Nếu kích thước màn hình >= 799px
                setOpenSidebar(false);  // Đóng sidebar khi thay đổi kích thước màn hình
            }
        };

        window.addEventListener("scroll", handleScroll);  // Lắng nghe sự kiện scroll
        window.addEventListener("resize", handleResize);  // Lắng nghe sự kiện resize

        return () => {
            window.removeEventListener("scroll", handleScroll);  // Xoá sự kiện scroll khi component bị huỷ
            window.removeEventListener("resize", handleResize);  // Xoá sự kiện resize khi component bị huỷ
        }
    }, []);

    const handleClose = (event: any) => {
        if (event.target.id === "screen") {
            setOpenSidebar(false);  // Đóng sidebar nếu người dùng nhấn ngoài màn hình
        }
    };

    return (
        <div className="w-full relative">
            <div
                className={`${
                    active
                        ? "fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1e] shadow-xl transition duration-500 bg-white bg-opacity-30 dark:bg-gray-900 dark:bg-opacity-30 backdrop-blur-md"
                        : "w-full border-b dark:border-[#ffffff1e] h-[80px] z-[80] dark:shadow"
                }`}
            >
                <div className="w-[95%] 880px:w-[92%] m-auto py-2 h-full">
                    <div className="w-full h-[80px] flex items-center justify-between p-3">
                        <div>
                            <Link
                                href={"/"}
                                className="text-[25px] font-Poppins font-[500] text-black dark:text-white"
                            >
                                ELearning  {/* Tên trang web */}
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <NavItems activeItem={activeItem} isMobile={false} />  {/* Hiển thị menu desktop */}
                            {/* Avatar hiển thị theo responsive */}
                            <div className="hidden 800px:block">
                                {user ? (
                                    <Link href={"/profile"}>
                                        <Image
                                            priority
                                            src={user.avatar ? user.avatar.url : avatarDefault}
                                            alt="User Avatar"
                                            width={30}
                                            height={30}
                                            className="h-[30px] w-[30px] rounded-full cursor-pointer"
                                            style={{
                                                border: activeItem === 5 ? "2px solid #37a39a" : "none"
                                            }}
                                        />
                                    </Link>
                                ) : (
                                    <HiOutlineUserCircle
                                        className="cursor-pointer dark:text-white text-black"
                                        size={25}
                                        onClick={() => setOpen(true)}
                                    />
                                )}
                            </div>
                            {/* Menu icon cho mobile */}
                            <div className="800px:hidden">
                                <HiOutlineMenuAlt3
                                    className="cursor-pointer dark:text-white text-black"
                                    size={25}
                                    onClick={() => setOpenSidebar(true)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Sidebar cho mobile */}
                {openSidebar && (
                    <div
                        className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
                        onClick={handleClose}
                        id="screen"
                    >
                        <div
                            className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0"
                        >
                            <NavItems activeItem={activeItem} isMobile={true} />  {/* Hiển thị menu cho mobile */}
                            {user ? (
                                <Link href={"/profile"}>
                                    <Image
                                        priority
                                        src={user.avatar ? user.avatar.url : avatarDefault}
                                        alt="User Avatar"
                                        width={30}
                                        height={30}
                                        className="h-[30px] w-[30px] rounded-full cursor-pointer ml-[20px]"
                                        style={{
                                            border: activeItem === 5 ? "2px solid #37a39a" : "none"
                                        }}
                                    />
                                </Link>
                            ) : (
                                <HiOutlineUserCircle
                                    className="block 800px:hidden cursor-pointer ml-[20px] dark:text-white text-black"
                                    size={25}
                                    onClick={() => setOpen(true)}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
            {
                ["Login", "Register", "Verification", "ForgetPassword", "ResetPassword"].includes(route) && open && (
                    <CustomModal
                        open={open}  // Trạng thái modal
                        activeItem={activeItem}
                        setOpen={setOpen}  // Hàm thay đổi trạng thái modal
                        setRoute={setRoute}  // Hàm thay đổi route
                        component={  // Tùy thuộc vào route hiện tại, hiển thị component tương ứng
                            route === "Login" ? Login :
                                route === "Register" ? Register :
                                    route === "Verification" ? Verification :
                                        route === "ForgetPassword" ? ForgetPassword :
                                            ResetPassword
                        }
                    />
                )
            }
        </div>
    );
};

export default Header;