"use client";

import Link from "next/link";
import React, { FC, useEffect, useState } from "react";

import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import NavItems from "../utils/NavItems";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import CustomModal from "../utils/CustomModal";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Verification from "./auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  useLogoutQuery,
  useSocialAuthMutation
} from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import avatarDefault from "../../public/assests/avatar.png";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ open, setOpen, activeItem, route, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const {
    data: userData,
    isLoading,
    refetch
  } = useLoadUserQuery(undefined, {});
  const { data } = useSession();
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
  const [logout, setLogout] = useState(false);

  const {} = useLogoutQuery(undefined, {
    skip: !logout ? true : false
  });

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  useEffect(() => {
    if (!isLoading) {
      if (!userData) {
        if (data) {
          socialAuth({
            email: data?.user?.email,
            name: data?.user?.name,
            avatar: data?.user?.image,
            password: "123456789"
          });
          refetch();
        }
      }
    }

    if (data === null) {
      if (isSuccess) {
        toast.success("Login successful");
      }
    }

    if (data === null && !isLoading && !userData) {
      setLogout(true);
    }
  }, [data, isSuccess, socialAuth, userData, isLoading, refetch]);

  const handleClose = (event: any) => {
    if (event.target.id === "screen") {
      {
        setOpenSidebar(false);
      }
    }
  };

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1e] shadow-xl transition duration-500 bg-white"
            : "w-full border-b dark:border-[#ffffff1e] h-[80px] z-[80] dark:shadow"
        }`}
      >
        <div className="w-[95%] 880px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex item-center justify-between p-3">
            <div>
              <Link
                href={"/"}
                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
              >
                ELearning
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              {/* only for mobile */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  className="cursor-pointer dark:text-white text-black"
                  size={25}
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
              {userData ? (
                <Link href={"/profile"}>
                  <Image
                    src={
                      userData.user.avatar
                        ? userData.user.avatar.url
                        : avatarDefault
                    }
                    alt=""
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
                  className="hidden 800px:block cursor-pointer dark:text-white text-black"
                  size={25}
                  onClick={() => setOpen(true)}
                />
              )}
            </div>
          </div>
        </div>
        {/* mobile sidebar */}
        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
              <NavItems activeItem={activeItem} isMobile={true} />
              {userData ? (
                <Link href={"/profile"}>
                  <Image
                    src={
                      userData.user.avatar
                        ? userData.user.avatar.url
                        : avatarDefault
                    }
                    alt=""
                    width={30}
                    height={30}
                    className="h-[30px] w-[30px] rounded-full ml-[20px] cursor-pointer"
                    style={{
                      border: activeItem === 5 ? "2px solid #37a39a" : "none"
                    }}
                  />
                </Link>
              ) : (
                <HiOutlineUserCircle
                  className="hidden 800px:block cursor-pointer dark:text-white text-black"
                  size={25}
                  onClick={() => setOpen(true)}
                />
              )}
              <br />
              <br />
              <p className="text-[16px] px-2 pl-5 dark:text-white text-black">
                Copyright © 2024 ELearning
              </p>
            </div>
          </div>
        )}
      </div>
      {route === "Login" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
              refetch={refetch}
            />
          )}
        </>
      )}

      {route === "Register" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Register}
            />
          )}
        </>
      )}

      {route === "Verification" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
