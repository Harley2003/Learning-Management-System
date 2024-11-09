import {useSelector} from "react-redux"; // Import useSelector từ redux để lấy dữ liệu từ store

// Custom hook useAuth kiểm tra xem người dùng đã đăng nhập hay chưa
export default function useAuth() {
    // Sử dụng useSelector để lấy dữ liệu người dùng từ state.auth trong Redux store
    const {user} = useSelector((state: any) => state.auth);

    // Trả về true nếu user tồn tại (đã đăng nhập), false nếu không
    return !!user; // Dùng !! để chuyển đổi bất kỳ giá trị falsy nào thành false, và giá trị truthy thành true
}