// Import React và các công cụ cần thiết từ redux và redux-persist
import React from "react";
import { persistor, store } from "@/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Loader from "@/app/components/Loader/Loader";

// Định nghĩa interface cho Props, giúp xác định kiểu dữ liệu cho children
interface ProvidersProps {
    children: any;  // Children là các thành phần con sẽ được bọc bởi Provider
}

// Component Providers để bao bọc ứng dụng với Redux và Redux Persist
export function Providers({ children }: ProvidersProps) {
    return (
        // Provider của react-redux cung cấp store cho toàn bộ ứng dụng
        <Provider store={store}>
            {/* PersistGate giúp duy trì (persist) trạng thái redux, đảm bảo dữ liệu được lưu vào bộ nhớ
                và phục hồi ngay cả khi reload trang */}
            <PersistGate loading={<Loader />} persistor={persistor}>
                {/* Render các thành phần con bên trong Providers */}
                {children}
            </PersistGate>
        </Provider>
    );
}