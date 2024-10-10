"use client";

import React, {FC, useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {HiOutlineMenuAlt3, HiOutlineUserCircle} from "react-icons/hi";
import NavItems from "../utils/NavItems";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import CustomModal from "../utils/CustomModal";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Verification from "./Auth/Verification";
import {useLoadUserQuery} from "@/redux/features/api/apiSlice";
import avatarDefault from "../../public/assests/avatar.png";
import {useSelector} from "react-redux";
import ForgetPassword from "@/app/components/Auth/ForgetPassword";
import ResetPassword from "@/app/components/Auth/ResetPassword";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number;
    route: string;
    setRoute: (route: string) => void;
};

const Header: FC<Props> = ({open, setOpen, activeItem, route, setRoute}) => {
    const [active, setActive] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);
    const {user} = useSelector((state: any) => state.auth);
    useLoadUserQuery(undefined);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 85) {
                setActive(true);
            } else {
                setActive(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleClose = (event: any) => {
        if (event.target.id === "screen") {
            setOpenSidebar(false);
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
                                ELearning
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <NavItems activeItem={activeItem} isMobile={false}/>
                            <ThemeSwitcher/>
                            {/* Avatar hiển thị theo responsive */}
                            <div className="hidden 800px:block">
                                {user ? (
                                    <Link href={"/profile"}>
                                        <Image
                                            priority={true}
                                            src={
                                                user.avatar
                                                    ? user.avatar.url
                                                    : avatarDefault
                                            }
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
                            className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
                            <NavItems activeItem={activeItem} isMobile={true}/>
                            {user ? (
                                <Link href={"/profile"}>
                                    <Image
                                        priority={true}
                                        src={
                                            user.avatar
                                                ? user.avatar.url
                                                : avatarDefault
                                        }
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
                            <br/>
                            <br/>
                            <p className="text-[16px] px-2 pl-5 dark:text-white text-black">
                                Copyright © 2024 ELearning
                            </p>
                        </div>
                    </div>
                )}
            </div>
            {
                ["Login", "Register", "Verification", "ForgetPassword", "ResetPassword"].includes(route) && open && (
                    <CustomModal
                        open={open}
                        activeItem={activeItem}
                        setOpen={setOpen}
                        setRoute={setRoute}
                        component={
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