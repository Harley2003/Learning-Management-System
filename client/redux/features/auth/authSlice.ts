import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa trạng thái ban đầu cho slice `auth`
const initialState = {
    user: "",           // Trạng thái người dùng (tên người dùng hoặc thông tin người dùng)
    token: "",          // Trạng thái token (access token)
    refreshToken: "",   // Trạng thái refresh token
};

// Tạo slice cho `auth`, bao gồm các reducers để quản lý trạng thái người dùng
const authSlice = createSlice({
    name: "auth",  // Tên slice
    initialState,  // Trạng thái ban đầu
    reducers: {
        // Reducer khi người dùng đăng ký, chỉ lưu lại token
        userRegister: (state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token;  // Lưu token vào trạng thái
        },

        // Reducer khi người dùng đăng nhập, lưu thông tin người dùng, access token và refresh token
        userLogin: (
            state,
            action: PayloadAction<{
                accessToken: string;
                user: string;
                refreshToken: string;
            }>
        ) => {
            state.token = action.payload.accessToken;  // Lưu access token
            state.refreshToken = action.payload.refreshToken;  // Lưu refresh token
            state.user = action.payload.user;  // Lưu thông tin người dùng
        },

        // Reducer khi người dùng đăng xuất, xóa thông tin người dùng và token
        userLogout: (state) => {
            state.token = "";  // Xóa access token
            state.user = "";   // Xóa thông tin người dùng
            state.refreshToken = "";  // Xóa refresh token
        },
    },
});

// Xuất các action để có thể dispatch từ component hoặc nơi khác trong ứng dụng
export const { userRegister, userLogin, userLogout } = authSlice.actions;

// Xuất reducer để kết hợp vào store
export default authSlice.reducer;