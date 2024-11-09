import { Schema, model, Document } from "mongoose";

// Định nghĩa interface FaqItem cho câu hỏi thường gặp
export interface FaqItem extends Document {
  question: string; // Câu hỏi
  answer: string; // Câu trả lời
}

// Định nghĩa interface Category cho danh mục
export interface Category extends Document {
  title: string; // Tiêu đề danh mục
}

// Định nghĩa interface BannerImage cho hình ảnh banner
export interface BannerImage extends Document {
  public_id: string; // ID công khai của hình ảnh
  url: string; // Địa chỉ URL của hình ảnh
}

// Định nghĩa interface Layout cho bố cục tổng thể
interface Layout extends Document {
  type: string; // Loại bố cục
  faq: FaqItem[]; // Danh sách các câu hỏi thường gặp
  categories: Category[]; // Danh sách danh mục
  banner: { // Thông tin banner
    image: BannerImage; // Hình ảnh banner
    title: string; // Tiêu đề banner
    subTitle: string; // Tiêu đề phụ banner
  };
}

// Định nghĩa schema cho câu hỏi thường gặp
const faqSchema = new Schema<FaqItem>({
  question: { type: String }, // Kiểu dữ liệu cho câu hỏi
  answer: { type: String } // Kiểu dữ liệu cho câu trả lời
});

// Định nghĩa schema cho danh mục
const categorySchema = new Schema<Category>({
  title: { type: String } // Kiểu dữ liệu cho tiêu đề danh mục
});

// Định nghĩa schema cho hình ảnh banner
const bannerImageSchema = new Schema<BannerImage>({
  public_id: { type: String }, // Kiểu dữ liệu cho ID công khai
  url: { type: String } // Kiểu dữ liệu cho URL hình ảnh
});

// Định nghĩa schema cho layout
const layoutSchema = new Schema<Layout>({
  type: { type: String }, // Kiểu dữ liệu cho loại bố cục
  faq: [faqSchema], // Danh sách các câu hỏi thường gặp
  categories: [categorySchema], // Danh sách các danh mục
  banner: { // Thông tin banner
    image: bannerImageSchema, // Hình ảnh banner
    title: { type: String }, // Tiêu đề banner
    subTitle: { type: String } // Tiêu đề phụ banner
  }
});

// Tạo mô hình Layout từ schema
const LayoutModel = model<Layout>("Layout", layoutSchema);

export default LayoutModel;