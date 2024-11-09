import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // Import API slice và fetchBaseQuery từ Redux Toolkit
import { userLogin } from "../auth/authSlice"; // Import action userLogin từ authSlice

// Tạo apiSlice với các endpoints để gọi các API liên quan đến xác thực
export const apiSlice = createApi({
    reducerPath: "api", // Đặt tên cho reducer
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_SERVER_URL }), // Đặt URL cơ sở cho API, thường là từ biến môi trường
    endpoints: (builder) => ({
        // Endpoint để refresh token
        refreshToken: builder.query({
            query: () => ({
                url: "refresh-token", // Định nghĩa URL endpoint để làm mới token
                method: "GET", // Phương thức HTTP là GET
                credentials: "include" as const // Gửi cookies với yêu cầu (nếu có)
            })
        }),

        // Endpoint để tải thông tin người dùng (load user)
        loadUser: builder.query({
            query: () => ({
                url: "get-user-info", // Định nghĩa URL endpoint để lấy thông tin người dùng
                method: "GET", // Phương thức HTTP là GET
                credentials: "include" as const // Gửi cookies với yêu cầu (nếu có)
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    // Khi yêu cầu API thành công, xử lý kết quả
                    const result = await queryFulfilled;
                    // Dispatch action để lưu thông tin người dùng và token vào Redux
                    dispatch(
                        userLogin({
                            accessToken: result.data.accessToken, // Lưu accessToken
                            refreshToken: result.data.refreshToken, // Lưu refreshToken
                            user: result.data.user // Lưu thông tin người dùng
                        })
                    );
                } catch (error: any) {
                    console.log(error); // Xử lý lỗi nếu có
                }
            }
        })
    })
});

// Export các hook tương ứng với các endpoint để sử dụng trong component React
export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;