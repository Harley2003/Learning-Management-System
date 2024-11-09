import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSlice from "./features/auth/authSlice";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// Tạo một Noop Storage dự phòng (dành cho môi trường server-side rendering hoặc môi trường không phải trình duyệt)
const createNoopStorage = () => ({
    getItem() {
        return Promise.resolve(null); // Trả về null mặc định
    },
    setItem() {
        return Promise.resolve(); // Không thực hiện gì (Noop)
    },
    removeItem() {
        return Promise.resolve(); // Không thực hiện gì (Noop)
    }
});

// Kiểm tra nếu `window` tồn tại để xác định phương thức lưu trữ:
// Sử dụng `localStorage` nếu có sẵn, nếu không thì sử dụng Noop Storage
const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

// Cấu hình cho redux-persist
const persistConfig = {
    key: "root", // Khóa để lưu trữ dữ liệu trong localStorage
    storage,     // Phương thức lưu trữ (localStorage hoặc Noop Storage)
    whitelist: ["auth"], // Chỉ lưu trữ slice "auth"
};

// Kết hợp các reducers thành root reducer, bao gồm apiSlice và authSlice
const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer, // Reducer cho slice API
    auth: authSlice,                          // Reducer cho slice auth
});

// Bọc rootReducer với persistReducer để thêm khả năng lưu trữ
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Cấu hình Redux store với persisted reducer và cài đặt middleware
export const store = configureStore({
    reducer: persistedReducer,                 // Root reducer có lưu trữ
    devTools: process.env.NODE_ENV !== "production", // Bật Redux DevTools trong môi trường phát triển
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,          // Tắt kiểm tra serializable cho các action không thể tuần tự hóa
        }).concat(apiSlice.middleware),         // Thêm middleware cho API
});

// Tạo và xuất persistor để quản lý phục hồi trạng thái đã lưu khi khởi động ứng dụng
export const persistor = persistStore(store);
