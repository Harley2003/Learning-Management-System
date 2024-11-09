import { Document, Model } from "mongoose";

// Giao diện để lưu trữ dữ liệu tháng và số lượng
interface MonthData {
  month: string; // Tên tháng và năm
  count: number; // Số lượng tài liệu được tạo trong tháng đó
}

/*
 * Hàm generateLast12MonthsData để tạo dữ liệu cho 12 tháng vừa qua.
 * Hàm nhận một mô hình Mongoose và trả về một Promise chứa dữ liệu tháng.
 */
export async function generateLast12MonthsData<T extends Document>(
    model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
  const last12Months: MonthData[] = []; // Mảng để lưu trữ dữ liệu tháng
  const currentDate = new Date(); // Lấy ngày hiện tại

  // Lặp qua 12 tháng
  for (let i = 0; i < 12; i++) {
    // Tính toán ngày kết thúc cho tháng hiện tại
    const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i + 1,
        0 // Ngày cuối cùng của tháng
    );

    // Tính toán ngày bắt đầu cho tháng hiện tại
    const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1 // Ngày đầu tiên của tháng
    );

    // Định dạng tháng và năm để hiển thị
    const monthYear = startDate.toLocaleString("default", {
      month: "short",
      year: "numeric" // Định dạng ngắn cho tháng và năm
    });

    // Đếm số lượng tài liệu được tạo trong khoảng thời gian từ startDate đến endDate
    const count = await model.countDocuments({
      createdAt: {
        $gte: startDate, // Ngày bắt đầu
        $lt: endDate // Ngày kết thúc
      }
    });

    // Thêm dữ liệu tháng vào mảng last12Months
    last12Months.unshift({ month: monthYear, count });
  }

  // Trả về dữ liệu cho 12 tháng vừa qua
  return { last12Months };
}