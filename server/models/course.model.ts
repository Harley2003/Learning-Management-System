import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

// Định nghĩa interface IComment cho bình luận
interface IComment extends Document {
    user: IUser; // Người dùng tạo bình luận
    question: string; // Câu hỏi hoặc nội dung bình luận
    questionReplies?: IComment[]; // Các phản hồi cho bình luận
}

// Định nghĩa interface IReview cho đánh giá
interface IReview extends Document {
    user: IUser; // Người dùng tạo đánh giá
    rating: number; // Điểm đánh giá
    comment: string; // Nội dung bình luận đánh giá
    commentReplies?: IComment[]; // Các phản hồi cho bình luận đánh giá
}

// Định nghĩa interface ILink cho liên kết
interface ILink extends Document {
    title: string; // Tiêu đề liên kết
    url: string; // Địa chỉ URL của liên kết
}

// Định nghĩa interface ICourseData cho dữ liệu khóa học
interface ICourseData extends Document {
    title: string; // Tiêu đề của phần dữ liệu khóa học
    description: string; // Mô tả phần dữ liệu khóa học
    videoUrl: string; // Địa chỉ video của khóa học
    videoThumbnail: object; // Hình thu nhỏ của video
    videoSection: string; // Phần của video (ví dụ: mô tả)
    videoLength: number; // Độ dài video
    videoPlayer: string; // Trình phát video
    links: ILink[]; // Danh sách các liên kết liên quan
    suggestion: string; // Đề xuất liên quan
    questions: IComment[]; // Các câu hỏi và bình luận liên quan
}

// Định nghĩa interface ICourse cho khóa học
interface ICourse extends Document {
    name: string; // Tên khóa học
    description: string; // Mô tả khóa học
    categories: string; // Danh mục của khóa học
    price: number; // Giá của khóa học
    estimatedPrice?: number; // Giá ước tính (nếu có)
    thumbnail: object; // Hình thu nhỏ của khóa học
    tags: string; // Thẻ gán cho khóa học
    level: string; // Cấp độ khóa học (ví dụ: cơ bản, nâng cao)
    demoUrl: string; // Địa chỉ URL của bản demo khóa học
    benefits: { title: string }[]; // Danh sách lợi ích của khóa học
    prerequisites: { title: string }[]; // Danh sách yêu cầu trước khi tham gia khóa học
    reviews: IReview[]; // Danh sách đánh giá cho khóa học
    courseData: ICourseData[]; // Dữ liệu khóa học chi tiết
    ratings?: number; // Điểm đánh giá tổng thể (nếu có)
    purchased?: number; // Số lượng mua khóa học
}

// Định nghĩa schema cho đánh giá
const reviewSchema = new Schema<IReview>(
    {
        user: Object, // Thông tin người dùng
        rating: {
            type: Number,
            default: 0 // Giá trị mặc định là 0
        },
        comment: String, // Bình luận đánh giá
        commentReplies: [Object] // Các phản hồi cho bình luận đánh giá
    },
    { timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Định nghĩa schema cho liên kết
const linkSchema = new Schema<ILink>({
    title: String, // Tiêu đề liên kết
    url: String // Địa chỉ URL của liên kết
});

// Định nghĩa schema cho bình luận
const commentSchema = new Schema<IComment>(
    {
        user: Object, // Thông tin người dùng
        question: String, // Câu hỏi hoặc nội dung bình luận
        questionReplies: [Object] // Các phản hồi cho bình luận
    },
    { timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Định nghĩa schema cho dữ liệu khóa học
const courseDataSchema = new Schema<ICourseData>({
    title: String, // Tiêu đề của phần dữ liệu khóa học
    description: String, // Mô tả phần dữ liệu khóa học
    videoUrl: String, // Địa chỉ video của khóa học
    videoSection: String, // Phần của video
    videoLength: Number, // Độ dài video
    videoPlayer: String, // Trình phát video
    links: [linkSchema], // Danh sách các liên kết liên quan
    suggestion: String, // Đề xuất liên quan
    questions: [commentSchema] // Các câu hỏi và bình luận liên quan
});

// Định nghĩa schema cho khóa học
const courseSchema = new Schema<ICourse>(
    {
        name: {
            type: String,
            required: true // Tên khóa học là bắt buộc
        },
        description: {
            type: String,
            required: true // Mô tả khóa học là bắt buộc
        },
        categories: {
            type: String,
            required: true // Danh mục khóa học là bắt buộc
        },
        price: {
            type: Number,
            required: true // Giá khóa học là bắt buộc
        },
        estimatedPrice: {
            type: Number // Giá ước tính (nếu có)
        },
        thumbnail: {
            public_id: {
                type: String // ID công khai của hình thu nhỏ
            },
            url: {
                type: String // Địa chỉ URL của hình thu nhỏ
            }
        },
        tags: {
            type: String,
            required: true // Thẻ gán cho khóa học là bắt buộc
        },
        level: {
            type: String,
            required: true // Cấp độ khóa học là bắt buộc
        },
        demoUrl: {
            type: String,
            required: true // Địa chỉ URL của bản demo khóa học là bắt buộc
        },
        benefits: [{ title: String }], // Danh sách lợi ích của khóa học
        prerequisites: [{ title: String }], // Danh sách yêu cầu trước khi tham gia khóa học
        reviews: [reviewSchema], // Danh sách đánh giá cho khóa học
        courseData: [courseDataSchema], // Dữ liệu khóa học chi tiết
        ratings: {
            type: Number,
            default: 0 // Giá trị mặc định là 0
        },
        purchased: {
            type: Number,
            default: 0 // Giá trị mặc định là 0
        }
    },
    { timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Tạo mô hình Course từ schema
const CourseModel: Model<ICourse> = mongoose.model<ICourse>(
    "Course",
    courseSchema
);

export default CourseModel;