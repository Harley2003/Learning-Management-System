import { apiSlice } from "../api/apiSlice"; // Import apiSlice để kết nối với API
import { userLogin, userLogout, userRegister } from "./authSlice"; // Import các action từ authSlice
import Cookies from "js-cookie"; // Thư viện để làm việc với cookies
import { persistor } from "@/redux/store"; // Giả sử persistor dùng để lưu trạng thái của redux

// Định nghĩa kiểu dữ liệu cho các phản hồi từ API
type RegisterResponse = {
    message: string;
    activationToken: string;
};

type RegisterData = {
    name: string;
    email: string;
    password: string;
};

type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    user: any;
};

type ForgetPasswordData = {
    email: string;
};

type ForgetPasswordResponse = {
    resetToken: string;
    message: string;
};

type ResetPasswordData = {
    password: string;
};

// Tạo endpoints cho các hành động liên quan đến xác thực người dùng (đăng ký, đăng nhập, đăng xuất, quên mật khẩu, thay đổi mật khẩu)
export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Đăng ký người dùng
        register: builder.mutation<RegisterResponse, RegisterData>({
            query: (data) => ({
                url: "register",
                method: "POST",
                body: data,
                credentials: "include",  // Gửi cookies với yêu cầu
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;  // Gọi API và lấy kết quả
                    dispatch(userRegister({ token: result.data.activationToken }));  // Dispatch action lưu activation token vào Redux
                } catch (error) {
                    console.error(error);
                }
            },
        }),

        // Kích hoạt người dùng (sau khi đăng ký)
        activation: builder.mutation({
            query: ({ activation_token, activation_code }) => ({
                url: "active-users",
                method: "POST",
                body: { activation_token, activation_code },
            }),
        }),

        // Đăng nhập người dùng
        login: builder.mutation<LoginResponse, { email: string; password: string }>({
            query: ({ email, password }) => ({
                url: "login",
                method: "POST",
                body: { email, password },
                credentials: "include",  // Gửi cookies với yêu cầu
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    // Lưu các token vào cookies
                    Cookies.set("access_token", result.data.accessToken);
                    Cookies.set("refresh_token", result.data.refreshToken);
                    // Dispatch action để lưu thông tin người dùng vào Redux
                    dispatch(
                        userLogin({
                            accessToken: result.data.accessToken,
                            refreshToken: result.data.refreshToken,
                            user: result.data.user,
                        })
                    );
                } catch (error: any) {
                    console.log("Login failed! Please try again.");
                }
            },
        }),

        // Đăng xuất người dùng
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "logout",
                method: "GET",
                credentials: "include", // Gửi cookies với yêu cầu
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                    // Xóa các token trong cookies khi người dùng đăng xuất
                    Cookies.remove("access_token");
                    Cookies.remove("refresh_token");
                    // Dispatch action để xóa thông tin người dùng trong Redux
                    dispatch(userLogout());
                } catch (error) {
                    console.error("Logout error:", error);
                }
            },
        }),

        // Quên mật khẩu (gửi email để reset mật khẩu)
        forgetPassword: builder.mutation<ForgetPasswordResponse, ForgetPasswordData>({
            query: (data) => ({
                url: "forget-password",
                method: "POST",
                body: data,
                credentials: "include", // Gửi cookies với yêu cầu
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                } catch (error) {
                    console.error("Forget password request failed:", error);
                }
            },
        }),

        // Đặt lại mật khẩu sau khi quên mật khẩu
        resetPassword: builder.mutation<ForgetPasswordResponse, { token: string; data: ResetPasswordData }>({
            query: ({ token, data }) => ({
                url: `reset-password/${token}`,
                method: "PATCH",
                body: data,
                credentials: "include", // Gửi cookies với yêu cầu
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                } catch (error) {
                    console.error("Reset password request failed:", error);
                }
            },
        }),
    }),
});

// Xuất các hook để sử dụng trong các component
export const {
    useRegisterMutation,
    useActivationMutation,
    useLoginMutation,
    useLogoutMutation,
    useForgetPasswordMutation,
    useResetPasswordMutation
} = authApi;