import { apiSlice } from "../api/apiSlice";
import { userLogin, userRegister } from "./authSlice";

type RegisterRespone = {
  message: string;
  activationToken: string;
};

type RegisterData = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here (register)
    register: builder.mutation<RegisterRespone, RegisterData>({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
        credentials: "include" as const
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegister({
              token: result.data.activationToken
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      }
    }),
    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: "active-users",
        method: "POST",
        body: { activation_token, activation_code }
      })
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: { email, password },
        credentials: "include" as const
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLogin({
              accessToken: result.data.accessToken,
              user: result.data.user
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      }
    }),
    socialAuth: builder.mutation({
      query: ({ email, name, avatar }) => ({
        url: "social-auth",
        method: "POST",
        body: { email, name, avatar },
        credentials: "include" as const
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLogin({
              accessToken: result.data.accessToken,
              user: result.data.user
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      }
    })
  })
});

export const { useRegisterMutation, useActivationMutation, useLoginMutation, useSocialAuthMutation } =
  authApi;
