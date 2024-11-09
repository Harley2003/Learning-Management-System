require("dotenv").config();
import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

// Định nghĩa interface cho tùy chọn email
interface EmailOptions {
    email: string; // Địa chỉ email người nhận
    subject: string; // Chủ đề của email
    template: string; // Tên file template email
    data: { [key: string]: any }; // Dữ liệu để truyền vào template
}

// Hàm gửi email
const sendMail = async (options: EmailOptions): Promise<void> => {
    // Tạo transporter sử dụng các thông tin SMTP từ biến môi trường
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, // Máy chủ SMTP
        port: parseInt(process.env.SMTP_PORT || "587"), // Cổng SMTP (mặc định là 587)
        service: process.env.SMTP_SERVICE, // Dịch vụ SMTP
        auth: {
            user: process.env.SMTP_MAIL, // Tên người dùng SMTP
            pass: process.env.SMTP_PASSWORD // Mật khẩu SMTP
        }
    });

    const { email, subject, template, data } = options; // Phân destructuring thông tin từ options

    // Lấy đường dẫn đến file template email
    const templatePath = path.join(__dirname, "../mails", template);

    // Render template email bằng EJS với dữ liệu được cung cấp
    const html: string = await ejs.renderFile(templatePath, data);

    // Định nghĩa các tùy chọn cho email
    const mailOptions = {
        from: process.env.SMTP_MAIL, // Địa chỉ email người gửi
        to: email, // Địa chỉ email người nhận
        subject, // Chủ đề email
        html // Nội dung email đã được render
    };

    try {
        // Gửi email sử dụng transporter
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error); // Ghi lại lỗi nếu có
        throw new Error("Email could not be sent"); // Ném lỗi nếu không thể gửi email
    }
};

export default sendMail;