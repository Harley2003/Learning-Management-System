import { apiSlice } from "../api/apiSlice";

// Định nghĩa các endpoint liên quan đến đơn hàng và thanh toán
export const orderApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Endpoint để lấy tất cả đơn hàng của admin
        getAllOrders: builder.query({
            query: () => ({
                url: `get-all-orders-admin`,  // Đường dẫn API để lấy tất cả đơn hàng
                method: "GET",  // Phương thức GET để lấy dữ liệu
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để lấy Stripe publishable key phục vụ cho thanh toán
        getStripePublishablekey: builder.query({
            query: () => ({
                url: `payment/stripepublishablekey`,  // Đường dẫn API để lấy Stripe publishable key
                method: "GET",  // Phương thức GET để lấy dữ liệu
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để tạo PaymentIntent với số tiền thanh toán
        createPaymentIntent: builder.mutation({
            query: (amount) => ({
                url: "payment",  // Đường dẫn API để tạo PaymentIntent
                method: "POST",  // Phương thức POST để gửi dữ liệu
                body: {
                    amount  // Số tiền thanh toán được gửi trong body
                },
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để tạo đơn hàng với thông tin khóa học và thanh toán
        createOrder: builder.mutation({
            query: ({ courseId, payment_info }) => ({
                url: "create-order",  // Đường dẫn API để tạo đơn hàng
                body: {
                    courseId,        // ID khóa học
                    payment_info     // Thông tin thanh toán
                },
                method: "POST",  // Phương thức POST để gửi dữ liệu
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để tạo đơn hàng miễn phí (không có thông tin thanh toán)
        createOrderFree: builder.mutation({
            query: ({ courseId }) => ({
                url: "create-order-free",  // Đường dẫn API để tạo đơn hàng miễn phí
                body: {
                    courseId  // ID khóa học
                },
                method: "POST",  // Phương thức POST để gửi dữ liệu
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        })
    })
});

// Xuất các hook để sử dụng các API endpoints trong các component
export const {
    useGetAllOrdersQuery,            // Hook để lấy tất cả đơn hàng
    useGetStripePublishablekeyQuery,  // Hook để lấy Stripe publishable key
    useCreatePaymentIntentMutation,   // Hook để tạo PaymentIntent
    useCreateOrderMutation,          // Hook để tạo đơn hàng với thông tin thanh toán
    useCreateOrderFreeMutation       // Hook để tạo đơn hàng miễn phí
} = orderApi;