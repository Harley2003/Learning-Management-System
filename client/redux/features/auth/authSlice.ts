import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegister: (state, action) => {
      state.token = action.payload.token;
    },
    userLogin: (state, action) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
    },
    userLogout: (state) => {
      state.token = null;
      state.user = null;
    }
  }
});

export const { userRegister, userLogin, userLogout } = authSlice.actions;

export default authSlice.reducer;
