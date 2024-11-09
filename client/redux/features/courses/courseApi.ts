import { apiSlice } from "../api/apiSlice";

// Định nghĩa các endpoint liên quan đến khóa học (course)
export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Endpoint để tạo mới khóa học
        createCourse: builder.mutation({
            query: (data) => ({
                url: "create-course",  // Đường dẫn API để tạo khóa học
                method: "POST",  // Phương thức POST để gửi dữ liệu tạo mới
                body: data,  // Dữ liệu khóa học cần tạo
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để lấy tất cả khóa học từ admin
        getAllCourses: builder.query({
            query: () => ({
                url: "get-all-courses-admin",  // Đường dẫn API để lấy danh sách khóa học
                method: "GET",  // Phương thức GET để lấy dữ liệu
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để chỉnh sửa thông tin khóa học
        editCourse: builder.mutation({
            query: ({id, data}) => ({
                url: `edit-course/${id}`,  // Đường dẫn API để chỉnh sửa khóa học theo ID
                method: "PUT",  // Phương thức PUT để cập nhật dữ liệu
                body: data,  // Dữ liệu cần cập nhật
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để xóa một khóa học
        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `delete-course/${id}`,  // Đường dẫn API để xóa khóa học theo ID
                method: "DELETE",  // Phương thức DELETE để xóa dữ liệu
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để lấy tất cả khóa học của người dùng
        getUsersAllCourses: builder.query({
            query: () => ({
                url: "get-all-courses",  // Đường dẫn API để lấy tất cả khóa học cho người dùng
                method: "GET",  // Phương thức GET để lấy dữ liệu
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để lấy chi tiết của một khóa học
        getCourseDetails: builder.query({
            query: (id) => ({
                url: `get-course/${id}`,  // Đường dẫn API để lấy chi tiết khóa học theo ID
                method: "GET",  // Phương thức GET để lấy dữ liệu
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để lấy nội dung của khóa học
        getCourseContent: builder.query({
            query: (id) => ({
                url: `get-course-content/${id}`,  // Đường dẫn API để lấy nội dung khóa học theo ID
                method: "GET",  // Phương thức GET để lấy dữ liệu
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để thêm câu hỏi vào khóa học
        addNewQuestion: builder.mutation({
            query: ({question, courseId, contentId}) => ({
                url: "add-question",  // Đường dẫn API để thêm câu hỏi
                method: "PUT",  // Phương thức PUT để gửi câu hỏi
                body: {
                    question,
                    courseId,
                    contentId
                },
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để thêm câu trả lời vào câu hỏi
        addAnswerInQuestion: builder.mutation({
            query: ({answer, courseId, contentId, questionId}) => ({
                url: "add-answer",  // Đường dẫn API để thêm câu trả lời vào câu hỏi
                method: "PUT",  // Phương thức PUT để gửi câu trả lời
                body: {answer, courseId, contentId, questionId},
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để thêm đánh giá vào khóa học
        addReviewInCourse: builder.mutation({
            query: ({review, rating, courseId}) => ({
                url: `add-review/${courseId}`,  // Đường dẫn API để thêm đánh giá vào khóa học
                method: "PUT",  // Phương thức PUT để gửi đánh giá
                body: {review, rating},
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        }),

        // Endpoint để thêm phản hồi vào đánh giá của khóa học
        addReplyReviewInCourse: builder.mutation({
            query: ({comment, courseId, reviewId}) => ({
                url: "add-reply-review",  // Đường dẫn API để thêm phản hồi vào đánh giá
                method: "PUT",  // Phương thức PUT để gửi phản hồi
                body: {comment, courseId, reviewId},
                credentials: "include" as const  // Bao gồm cookie trong yêu cầu
            })
        })
    })
});

// Xuất các hook để sử dụng các API endpoints trong các component
export const {
    useCreateCourseMutation,        // Hook để tạo khóa học
    useGetAllCoursesQuery,          // Hook để lấy tất cả khóa học từ admin
    useEditCourseMutation,          // Hook để chỉnh sửa khóa học
    useDeleteCourseMutation,        // Hook để xóa khóa học
    useGetUsersAllCoursesQuery,     // Hook để lấy tất cả khóa học của người dùng
    useGetCourseDetailsQuery,       // Hook để lấy chi tiết khóa học
    useGetCourseContentQuery,       // Hook để lấy nội dung khóa học
    useAddNewQuestionMutation,      // Hook để thêm câu hỏi vào khóa học
    useAddAnswerInQuestionMutation,// Hook để thêm câu trả lời vào câu hỏi
    useAddReviewInCourseMutation,   // Hook để thêm đánh giá vào khóa học
    useAddReplyReviewInCourseMutation  // Hook để thêm phản hồi vào đánh giá khóa học
} = courseApi;