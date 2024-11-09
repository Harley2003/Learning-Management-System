import React, { FC, useEffect, useState } from "react";
import avatarDefault from "@/public/assests/avatar.png";
import Image from "next/image";
import { AiOutlineCamera } from "react-icons/ai";
import { styles } from "@/app/styles/style";
import {
    useEditProfilfeMutation,
    useUpdateAvatarMutation
} from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

type Props = {
    avatar: any;
    setAvatar: any;
    user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user, setAvatar }) => {
    // State lưu trữ tên của người dùng
    const [name, setName] = useState(user?.name || "");

    // Hooks cho việc cập nhật avatar và tên người dùng
    const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
    const { refetch } = useLoadUserQuery(user);
    const [editProfile, { isSuccess: successEdit, error: errorEdit, isLoading }] = useEditProfilfeMutation();

    // Hàm xử lý việc chọn ảnh mới (cập nhật avatar)
    const handlerImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Lấy file từ input
        if (file) {
            const fileReader = new FileReader(); // Tạo một FileReader để đọc file

            fileReader.onload = async () => {
                if (fileReader.readyState === 2) { // Kiểm tra xem file đã được tải thành công chưa
                    const avatar = fileReader.result as string; // Lấy avatar dưới dạng Data URL
                    setAvatar(avatar); // Cập nhật avatar trong state
                    try {
                        await updateAvatar(avatar); // Cập nhật avatar lên backend
                    } catch (err) {
                        toast.error("Error updating avatar."); // Hiển thị thông báo lỗi nếu cập nhật không thành công
                    }
                }
            };

            fileReader.onerror = () => {
                console.log("Error reading file.") // Log lỗi nếu không thể đọc file
            };

            fileReader.readAsDataURL(file); // Đọc file dưới dạng Data URL
        }
    };

    // Hàm xử lý việc gửi form (cập nhật tên người dùng)
    const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Ngăn không cho form reload trang
        if (name.trim() !== "") { // Kiểm tra xem tên có trống không
            await editProfile({ name }); // Gửi cập nhật tên lên backend
        }
    };

    // useEffect khi cập nhật avatar thành công
    useEffect(() => {
        if (isSuccess) {
            refetch(); // Refetch dữ liệu người dùng sau khi cập nhật avatar
            toast.success("Avatar updated successfully"); // Hiển thị thông báo thành công
        }
    }, [isSuccess, refetch, error]);

    // useEffect khi cập nhật tên người dùng thành công
    useEffect(() => {
        if (successEdit) {
            refetch(); // Refetch dữ liệu người dùng sau khi cập nhật tên
            toast.success("Profile updated successfully"); // Hiển thị thông báo thành công
        }
    }, [successEdit, refetch, error]);

    return (
        <>
            <div className="w-full flex justify-center">
                <div className="relative">
                    {/* Hiển thị avatar người dùng */}
                    <Image
                        priority
                        src={user.avatar?.url || avatar || avatarDefault} // Nếu không có avatar, sử dụng avatar mặc định
                        alt="User Avatar"
                        className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"
                        width={120}
                        height={120}
                    />
                    {/* Input file ẩn để thay đổi avatar */}
                    <input
                        type="file"
                        name="avatar"
                        id="avatar"
                        className="hidden"
                        onChange={handlerImage} // Gọi hàm handlerImage khi chọn file
                        accept="image/png,image/jpg,image/jpeg,image/webp"
                    />
                    {/* Biểu tượng máy ảnh để mở input file */}
                    <label htmlFor="avatar">
                        <div
                            className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
                            <AiOutlineCamera size={20} className="z-1" />
                        </div>
                    </label>
                </div>
            </div>
            <br />
            <br />
            <div className="w-full pl-6 800px:pl-10">
                <form onSubmit={handlerSubmit}>
                    <div className="800px:w-[50%] m-auto block pb-4">
                        {/* Input cho tên người dùng */}
                        <div className="w-[100%]">
                            <label className="block pb-2">Full Name</label>
                            <input
                                type="text"
                                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)} // Cập nhật tên khi người dùng thay đổi
                            />
                        </div>
                        {/* Input cho địa chỉ email (chỉ đọc) */}
                        <div className="w-[100%] pt-2">
                            <label className="block pb-2">Email Address</label>
                            <input
                                type="text"
                                className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                                required
                                value={user?.email}
                                readOnly // Đặt input là chỉ đọc
                            />
                        </div>
                        {/* Nút gửi form */}
                        <div className="flex justify-center mt-8">
                            <input
                                type="submit"
                                className="w-full 800px:w-[250px] h-[40px] border border-[#37a39a] text-center dark:text-[#fff] text-black rounded-[3px] cursor-pointer"
                                value={`${isLoading ? "Updating..." : "Update"}`} // Hiển thị "Đang cập nhật..." nếu đang tải
                                disabled={isLoading} // Vô hiệu hóa nút khi đang cập nhật
                            />
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProfileInfo;