import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  user: "",
  token: ""
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegister: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    userLogin: (
      state,
      action: PayloadAction<{ accessToken: string; user: string }>
    ) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
    },
    userLogout: (state: any) => {
      state.token = "";
      state.user = "";
    }
  }
});

export const { userRegister, userLogin, userLogout } = authSlice.actions;

export default authSlice.reducer;
