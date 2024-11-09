// Lớp ErrorHandler kế thừa từ lớp Error của JavaScript
class ErrorHandler extends Error {
  statusCode: Number; // Mã trạng thái HTTP tương ứng với lỗi

  /*
   * Constructor để khởi tạo thông điệp lỗi và mã trạng thái
   * @param message: thông điệp lỗi
   * @param statusCode: mã trạng thái HTTP (mặc định là 500 nếu không có)
   */
  constructor(message: any, statusCode: Number) {
    super(message); // Gọi hàm khởi tạo của lớp cha (Error)
    this.statusCode = statusCode || 500; // Gán mã trạng thái, mặc định là 500
    Error.captureStackTrace(this, this.constructor); // Ghi lại stack trace của lỗi
  }
}

export default ErrorHandler;