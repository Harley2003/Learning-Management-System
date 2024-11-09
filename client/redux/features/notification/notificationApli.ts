import { apiSlice } from "../api/apiSlice";

// Định nghĩa các endpoint liên quan đến thông báo (notifications)
export const notificationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Endpoint để lấy tất cả thông báo
        getAllNotifications: builder.query({
            query: () => ({
                url: "get-all-notifications",  // Đường dẫn API để lấy tất cả thông báo
                method: "GET",  // Phương thức GET để lấy dữ liệu
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để cập nhật trạng thái của một thông báo
        updateNotificationStatus: builder.mutation({
            query: (id) => ({
                url: `/update-notification/${id}`,  // Đường dẫn API để cập nhật trạng thái thông báo
                method: "PUT",  // Phương thức PUT để gửi dữ liệu cập nhật
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        })
    })
});

// Xuất các hook để sử dụng các API endpoints trong các component
export const {
    useGetAllNotificationsQuery,   // Hook để lấy tất cả thông báo
    useUpdateNotificationStatusMutation  // Hook để cập nhật trạng thái thông báo
} = notificationsApi;