import { apiSlice } from "../api/apiSlice";
import { userRegister } from "./authSlice";

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
    })
  })
});

export const { useRegisterMutation, useActivationMutation } = authApi;
