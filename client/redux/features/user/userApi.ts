import { apiSlice } from "../api/apiSlice";

// Định nghĩa các endpoint liên quan đến người dùng
export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Endpoint để cập nhật avatar người dùng
        updateAvatar: builder.mutation({
            query: (avatar) => ({
                url: "update-user-avatar",  // Đường dẫn API để cập nhật avatar
                method: "PUT",  // Sử dụng phương thức PUT để cập nhật
                body: { avatar },  // Gửi avatar mới trong body
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để chỉnh sửa thông tin người dùng (ví dụ: thay đổi tên)
        editProfilfe: builder.mutation({
            query: ({ name }) => ({
                url: "update-user-info",  // Đường dẫn API để cập nhật thông tin người dùng
                method: "PUT",  // Phương thức PUT để cập nhật
                body: { name },  // Gửi tên mới trong body
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để thay đổi mật khẩu người dùng
        updatePassword: builder.mutation({
            query: ({ oldPassword, newPassword }) => ({
                url: "update-user-password",  // Đường dẫn API để thay đổi mật khẩu
                method: "PUT",  // Sử dụng phương thức PUT để cập nhật mật khẩu
                body: { oldPassword, newPassword },  // Gửi mật khẩu cũ và mới trong body
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để lấy danh sách tất cả người dùng cho admin
        getAllUsers: builder.query({
            query: () => ({
                url: "get-all-users-admin",  // Đường dẫn API để lấy tất cả người dùng
                method: "GET",  // Phương thức GET để lấy dữ liệu
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để cập nhật vai trò người dùng (admin, user, v.v.)
        updateUserRole: builder.mutation({
            query: ({ email, role }) => ({
                url: "update-user-role",  // Đường dẫn API để cập nhật vai trò
                method: "PUT",  // Sử dụng phương thức PUT để cập nhật vai trò
                body: { email, role },  // Gửi email và vai trò mới trong body
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để xóa người dùng
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `delete-user/${id}`,  // Đường dẫn API để xóa người dùng theo ID
                method: "DELETE",  // Phương thức DELETE để xóa
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để kích hoạt hoặc hủy kích hoạt tài khoản người dùng
        activateDeactivateAccount: builder.mutation({
            query: ({ userId, isActivate }) => ({
                url: "update-user-status",  // Đường dẫn API để cập nhật trạng thái tài khoản
                method: "POST",  // Sử dụng phương thức POST để thay đổi trạng thái
                body: { userId, isActivate },  // Gửi ID người dùng và trạng thái kích hoạt
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        })
    })
});

// Xuất các hook để sử dụng các API endpoints trong các component
export const {
    useUpdateAvatarMutation,              // Hook để cập nhật avatar người dùng
    useEditProfilfeMutation,              // Hook để chỉnh sửa thông tin người dùng
    useUpdatePasswordMutation,            // Hook để thay đổi mật khẩu người dùng
    useGetAllUsersQuery,                  // Hook để lấy danh sách tất cả người dùng
    useUpdateUserRoleMutation,            // Hook để cập nhật vai trò người dùng
    useDeleteUserMutation,                // Hook để xóa người dùng
    useActivateDeactivateAccountMutation  // Hook để kích hoạt hoặc hủy kích hoạt tài khoản người dùng
} = userApi;