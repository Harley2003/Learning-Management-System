import {apiSlice} from "../api/apiSlice";
import {userLogin, userLogout, userRegister} from "./authSlice";
import Cookies from "js-cookie";

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

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<RegisterResponse, RegisterData>({
            query: (data) => ({
                url: "register",
                method: "POST",
                body: data,
                credentials: "include",
            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userRegister({token: result.data.activationToken}));
                } catch (error) {
                    console.error(error);
                }
            },
        }),

        activation: builder.mutation({
            query: ({activation_token, activation_code}) => ({
                url: "active-users",
                method: "POST",
                body: {activation_token, activation_code},
            }),
        }),

        login: builder.mutation<LoginResponse, { email: string; password: string }>({
            query: ({email, password}) => ({
                url: "login",
                method: "POST",
                body: {email, password},
                credentials: "include",
            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    Cookies.set("access_token", result.data.accessToken);
                    Cookies.set("refresh_token", result.data.refreshToken);
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

        logout: builder.mutation<void, void>({
            query: () => ({
                url: "logout",
                method: "GET",
                credentials: "include",
            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}) {
                try {
                    await queryFulfilled;
                    Cookies.remove("access_token");
                    Cookies.remove("refresh_token");
                    dispatch(userLogout());
                } catch (error) {
                    console.error("Logout error:", error);
                }
            },
        }),

        forgetPassword: builder.mutation<ForgetPasswordResponse, ForgetPasswordData>({
            query: (data) => ({
                url: "forget-password",
                method: "POST",
                body: data,
                credentials: "include",
            }),
            async onQueryStarted(arg, {queryFulfilled}) {
                try {
                    const result = await queryFulfilled;
                } catch (error) {
                    console.error("Forget password request failed:", error);
                }
            },
        }),

        resetPassword: builder.mutation<ForgetPasswordResponse, { token: string; data: ResetPasswordData }>({
            query: ({token, data}) => ({
                url: `reset-password/${token}`,
                method: "PATCH",
                body: data,
                credentials: "include",
            }),
            async onQueryStarted(arg, {queryFulfilled}) {
                try {
                    const result = await queryFulfilled;
                } catch (error) {
                    console.error("Reset password request failed:", error);
                }
            },
        }),

    }),
});

export const {
    useRegisterMutation,
    useActivationMutation,
    useLoginMutation,
    useLogoutMutation,
    useForgetPasswordMutation,
    useResetPasswordMutation
} = authApi;
