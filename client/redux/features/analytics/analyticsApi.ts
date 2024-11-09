import { apiSlice } from "../api/apiSlice"; // Import apiSlice đã được cấu hình trước đó

// Tạo một slice mới cho analytics
export const analyticsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Endpoint để lấy phân tích khóa học
        getCoursesAnalytics: builder.query({
            query: () => ({
                url: "get-courses-analytics", // Định nghĩa URL endpoint
                method: "GET", // Phương thức HTTP là GET
                credentials: "include" as const // Gửi cookies với yêu cầu
            })
        }),

        // Endpoint để lấy phân tích người dùng
        getUsersAnalytics: builder.query({
            query: () => ({
                url: "get-users-analytics", // Định nghĩa URL endpoint
                method: "GET", // Phương thức HTTP là GET
                credentials: "include" as const // Gửi cookies với yêu cầu
            })
        }),

        // Endpoint để lấy phân tích đơn hàng
        getOrdersAnalytics: builder.query({
            query: () => ({
                url: "get-orders-analytics", // Định nghĩa URL endpoint
                method: "GET", // Phương thức HTTP là GET
                credentials: "include" as const // Gửi cookies với yêu cầu
            })
        })
    })
});

// Export các hook tương ứng với các endpoint để sử dụng trong component React
export const {
    useGetCoursesAnalyticsQuery, // Hook để lấy phân tích khóa học
    useGetUsersAnalyticsQuery, // Hook để lấy phân tích người dùng
    useGetOrdersAnalyticsQuery // Hook để lấy phân tích đơn hàng
} = analyticsApi;