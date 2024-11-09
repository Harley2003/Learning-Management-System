import React, { FC, useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile";  // Import component sidebar hiển thị thông tin người dùng
import ProfileInfo from "./ProfileInfo";  // Import component hiển thị thông tin hồ sơ người dùng
import ChangePassword from "./ChangePassword";  // Import component thay đổi mật khẩu
import CourseCard from "../Course/CourseCard";  // Import component để hiển thị khóa học của người dùng
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/courseApi";  // Hook lấy danh sách tất cả khóa học
import Loader from "../Loader/Loader";  // Import component Loader hiển thị khi đang tải dữ liệu
import { useLogoutMutation } from "@/redux/features/auth/authApi";  // Hook đăng xuất người dùng
import { useRouter } from "next/navigation";  // Dùng router để chuyển hướng người dùng
import { persistor } from "@/redux/store";  // Persistor để xoá dữ liệu khỏi Redux Persist khi đăng xuất

type Props = {
    user: any;  // Thông tin người dùng được truyền vào từ props
};

const Profile: FC<Props> = ({ user }) => {
    // State để theo dõi scroll, avatar, active tab và danh sách khóa học
    const [scroll, setScroll] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [active, setActive] = useState(1);  // Tab mặc định là tab đầu tiên (Profile Info)
    const [courses, setCourses] = useState([]);  // Lưu danh sách khóa học của người dùng

    const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});  // Lấy dữ liệu khóa học từ API
    const [logout] = useLogoutMutation();  // Hook đăng xuất người dùng
    const router = useRouter();  // Router để điều hướng trang

    // Xử lý đăng xuất người dùng
    const logOutHandler = async () => {
        try {
            await logout().unwrap();  // Thực hiện logout
            await persistor.purge();  // Xoá dữ liệu persisted từ Redux Persist
            router.push("/");  // Điều hướng về trang chủ
        } catch (error) {
            console.error("Logout error:", error);  // Xử lý lỗi đăng xuất
        }
    };

    // useEffect để theo dõi sự thay đổi của scroll position
    useEffect(() => {
        const handleScroll = () => {
            setScroll(window.scrollY > 85);  // Nếu scroll vượt quá 85px, set scroll thành true
        };

        window.addEventListener("scroll", handleScroll);  // Thêm event listener cho scroll
        return () => {
            window.removeEventListener("scroll", handleScroll);  // Dọn dẹp event listener khi component bị unmount
        };
    }, []);

    // useEffect để lọc các khóa học của người dùng dựa trên dữ liệu từ API
    useEffect(() => {
        if (data) {
            const filteredCourses = user.courses?.map((userCourse: any) => data.courses.find((course: any) => course._id === userCourse._id)).filter(Boolean);
            setCourses(filteredCourses);  // Lưu lại các khóa học phù hợp
        }
    }, [data, user.courses]);  // Cập nhật lại khi dữ liệu hoặc danh sách khóa học của người dùng thay đổi

    // Render component tương ứng với tab đang được chọn
    const renderActiveComponent = () => {
        switch (active) {
            case 1:  // Tab Profile Info
                return <ProfileInfo user={user} avatar={avatar} setAvatar={setAvatar} />;
            case 2:  // Tab Change Password
                return <ChangePassword />;
            case 3:  // Tab Courses
                return (
                    user.role !== "admin" && (
                        <div className="w-full pl-7 px-2 800px:px-10 800px:pl-8">
                            <div
                                className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-3 xl:gap-[35px]"
                            >
                                {courses.map((item: any, index: number) => (
                                    <CourseCard item={item} key={index} user={user} isProfile={true} />
                                ))}
                            </div>
                            {courses.length === 0 && (
                                <h1 className="text-center text-[30px] font-Poppins mt-[15rem]">
                                    You don&apos;t have any purchased course!
                                </h1>
                            )}
                        </div>
                    )
                );
        }
    };

    return (
        <div>
            {isLoading ? (  // Nếu dữ liệu khóa học đang tải, hiển thị Loader
                <Loader />
            ) : (
                <div className="w-[85%] flex mx-auto mt-[11px]">
                    <div
                        className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-white bg-opacity-90 border dark:border-[#ffffff1d] border-[#00000014] rounded-[5px] dark:shadow-sm shadow-xl mt-[80px] mb-[80px] sticky ${scroll ? "top-[120px]" : "top-[30px]"} left-[30px]`}
                    >
                        <SideBarProfile
                            user={user}  // Truyền thông tin người dùng vào Sidebar
                            active={active}  // Truyền tab đang được chọn
                            avatar={avatar}  // Truyền avatar người dùng
                            setActive={setActive}  // Hàm set tab đang được chọn
                            logOutHandler={logOutHandler}  // Hàm đăng xuất
                        />
                    </div>
                    <div className="w-full h-full bg-transparent mt-[80px]">
                        {renderActiveComponent()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;