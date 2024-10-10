"use client";

import {FC, useEffect, useState} from "react";
import {ProSidebar, Menu, MenuItem} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {Box, IconButton, Typography} from "@mui/material";
import {
    HomeOutlinedIcon,
    ArrowBackIosIcon,
    PeopleOutlinedIcon,
    ReceiptOutlinedIcon,
    BarChartOutlinedIcon,
    MapOutlinedIcon,
    GroupsIcon,
    OndemandVideoIcon,
    VideoCallIcon,
    WebIcon,
    QuizIcon,
    WysiwygIcon,
    ManageHistoryIcon,
    ExitToAppIcon
} from "./Icon";
import avatarDefault from "../../../../public/assests/avatar.png";
import Link from "next/link";
import Image from "next/image";
import {useTheme} from "next-themes";
import {useLogoutMutation} from "@/redux/features/auth/authApi";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";

interface ItemProps {
    title: string;
    to: string;
    icon: JSX.Element;
    selected: string;
    setSelected: (value: string) => void;
}

const Item: FC<ItemProps> = ({title, to, icon, selected, setSelected}) => (
    <MenuItem
        active={selected === title}
        onClick={() => setSelected(title)}
        icon={icon}
        className="hover:!bg-[unset]"
    >
        <Link href={to} className="hover:!bg-[unset]">
            <Typography className="!text-[16px] !font-Poppins text-black dark:text-white">
                {title}
            </Typography>
        </Link>
    </MenuItem>
);

interface AdminSidebarProps {
    data?: any;
}

const AdminSidebar: FC<AdminSidebarProps> = ({data}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");
    const {theme} = useTheme();
    const router = useRouter();
    const {user} = useSelector((state: any) => state.auth);
    const [logout] = useLogoutMutation();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 998) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const logoutHandler = async () => {
        try {
            await logout().unwrap();
            router.push("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <Box
            sx={{
                "& .pro-sidebar-inner": {
                    background:
                        theme === "dark" ? "#111C43 !important" : "#fff !important"
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important"
                },
                "& .pro-inner-item:hover": {
                    color: "#868dfb !important"
                },
                "& .pro-menu-item.active": {
                    color: "#6870fa !important"
                },
                "& .pro-inner-item": {
                    padding: "5px 35px 5px 20px !important",
                    opacity: 1
                },
                "& .pro-menu-item": {
                    color: theme !== "dark" ? "#000" : "#fff"
                }
            }}
            className="!bg-white dark:bg-[#111C43]"
        >
            <ProSidebar
                collapsed={isCollapsed}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    zIndex: 99999999999999,
                    width: isCollapsed ? "0%" : "16%"
                }}
            >
                <Menu>
                    <MenuItem
                        // onClick={() => setIsCollapsed(!isCollapsed)}
                        // icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
                        style={{margin: "10px 0 20px 0"}}
                    >
                        {!isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                ml="15px"
                            >
                                <Link href="/" className="inline-block">
                                    <h3 className="text-[25px] font-Poppins uppercase dark:text-white text-black">
                                        ELearning
                                    </h3>
                                </Link>
                                {/*<IconButton*/}
                                {/*  onClick={() => setIsCollapsed(!isCollapsed)}*/}
                                {/*  className="inline-block"*/}
                                {/*>*/}
                                {/*  <ArrowBackIosIcon className="text-black dark:text-[#ffffffc1]" />*/}
                                {/*</IconButton>*/}
                            </Box>
                        )}
                    </MenuItem>

                    {!isCollapsed && (
                        <Box mb="25px">
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <Image
                                    alt="profile-user"
                                    width={100}
                                    height={100}
                                    src={user.avatar ? user.avatar.url : avatarDefault}
                                    style={{
                                        // cursor: "pointer",
                                        borderRadius: "50%",
                                        border: "3px solid #5b6fe6"
                                    }}
                                />
                            </Box>
                            <Box textAlign="center">
                                <Typography
                                    variant="h4"
                                    className="!text-[20px] text-black dark:text-[#ffffffc1]"
                                    sx={{m: "20px 0 0 0"}}
                                >
                  <span className="text-gradient">
                    {user?.name} - {user?.role.toUpperCase()}
                  </span>
                                </Typography>
                                {/* <Typography
                    variant="h6"
                    sx={{ m: "10px 0 0 0" }}
                    className="!text-[20px] text-black dark:text-[#ffffffc1] capitalize"
                  > 
                  </Typography> */}
                            </Box>
                        </Box>
                    )}

                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Item
                            title="Dashboard"
                            to="/admin"
                            icon={<HomeOutlinedIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        {/* <Typography
                variant="h5"
                sx={{ m: "15px 0 5px 25px" }}
                className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
              >
                {!isCollapsed && "Data"}
              </Typography> */}
                        <Typography
                            variant="h5"
                            className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
                            sx={{m: "15px 0 5px 20px"}}
                        >
                            {!isCollapsed && "Controllers"}
                        </Typography>
                        <Item
                            title="Manage Team"
                            to="/admin/manager-team"
                            icon={<PeopleOutlinedIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Users"
                            to="/admin/display-users"
                            icon={<GroupsIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Invoices"
                            to="/admin/invoices"
                            icon={<ReceiptOutlinedIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography
                            variant="h5"
                            className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
                            sx={{m: "15px 0 5px 20px"}}
                        >
                            {!isCollapsed && "Content"}
                        </Typography>
                        <Item
                            title="Create Course"
                            to="/admin/create-course"
                            icon={<VideoCallIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Manager Courses"
                            to="/admin/display-courses"
                            icon={<OndemandVideoIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h6"
                            className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
                            sx={{m: "15px 0 5px 20px"}}
                        >
                            {!isCollapsed && "Analytics"}
                        </Typography>
                        <Item
                            title="Courses Analytics"
                            to="/admin/courses-analytic"
                            icon={<BarChartOutlinedIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h6"
                            className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
                            sx={{m: "15px 0 5px 20px"}}
                        >
                            {!isCollapsed && "Extras"}
                        </Typography>
                        <div onClick={logoutHandler}>
                            <Item
                                title="Logout"
                                to="/"
                                icon={<ExitToAppIcon/>}
                                selected={selected}
                                setSelected={setSelected}
                            />
                        </div>
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default AdminSidebar;
