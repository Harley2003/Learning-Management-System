import React, {FC} from "react";
import {Modal, Box} from "@mui/material";

// Định nghĩa kiểu Props cho component CustomModal
type Props = {
    open: boolean; // Trạng thái mở/đóng modal
    setOpen: (open: boolean) => void; // Hàm để thay đổi trạng thái mở/đóng modal
    activeItem: any; // Mục đang hoạt động, có thể sử dụng cho các chức năng khác
    component: any; // Component sẽ được hiển thị trong modal
    setRoute?: (route: string) => void; // Tùy chọn: Hàm để thay đổi route nếu có
    refetch?: any; // Tùy chọn: Hàm để refetch dữ liệu nếu cần
};

// Component CustomModal để hiển thị modal với nội dung động từ `component` truyền vào
const CustomModal: FC<Props> = ({
                                    open,               // Trạng thái mở modal
                                    setOpen,            // Hàm để đóng modal
                                    activeItem,         // Mục hoạ động hiện tại
                                    component: Component,  // Component sẽ được hiển thị trong modal
                                    setRoute            // Tùy chọn: Hàm thay đổi route
                                }) => {

    // Hàm xử lý đóng modal và thay đổi route nếu cần
    const handleClose = () => {
        setOpen(false); // Đóng modal
        if (setRoute) {  // Nếu có hàm setRoute, chuyển hướng về route "Login"
            setRoute("Login");
        }
    };

    return (
        <Modal
            open={open}                     // Trạng thái mở modal
            onClose={handleClose}           // Hàm xử lý khi modal bị đóng
            aria-labelledby="modal-modal-title"   // Tiêu đề cho modal (cho truy cập)
            aria-describedby="modal-modal-description" // Mô tả modal (cho truy cập)
        >
            <Box
                className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow py-4 outline-none">
                {/* Render component truyền vào */}
                <Component setOpen={setOpen} setRoute={setRoute} />
            </Box>
        </Modal>
    );
};

export default CustomModal;
