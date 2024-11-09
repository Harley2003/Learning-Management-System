import React, {FC} from "react";
import {AiFillStar, AiOutlineStar} from "react-icons/ai"; // Import các icon ngôi sao đầy và ngôi sao viền
import {BsStarHalf} from "react-icons/bs"; // Import icon ngôi sao nửa đầy

// Định nghĩa kiểu dữ liệu cho các props của component Ratings
type Props = {
    rating: number; // Giá trị đánh giá (rating), dạng số
    isDemo?: boolean; // Thuộc tính tùy chọn để kiểm tra chế độ demo
};

// Component Ratings để hiển thị đánh giá theo số ngôi sao (1-5)
const Ratings: FC<Props> = ({rating, isDemo}) => {
    const stars = []; // Mảng chứa các icon ngôi sao

    // Vòng lặp tạo ngôi sao dựa trên rating
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            // Thêm icon ngôi sao đầy nếu chỉ số i <= giá trị rating
            stars.push(
                <AiFillStar
                    key={i} // Khóa duy nhất cho mỗi phần tử trong mảng
                    size={20} // Kích thước của icon
                    color="#f6b100" // Màu của ngôi sao
                    className={`mr-2 ${!isDemo && "cursor-pointer"}`} // Thêm con trỏ nếu không ở chế độ demo
                />
            );
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            // Thêm icon nửa ngôi sao nếu rating là số thập phân và tròn đến giá trị gần nhất
            stars.push(
                <BsStarHalf
                    key={i}
                    size={17}
                    color="#f6ba00"
                    className={`mr-2 ${!isDemo && "cursor-pointer"}`}
                />
            );
        } else {
            // Thêm icon ngôi sao rỗng nếu chỉ số i > giá trị rating
            stars.push(
                <AiOutlineStar
                    key={i}
                    size={20}
                    color="#f6ba00"
                    className={`mr-2 ${!isDemo && "cursor-pointer"}`}
                />
            );
        }
    }

    // Trả về một div chứa các icon ngôi sao đã tạo
    return <div className="flex mt-1 ml-2 800px:mt-0 800px:ml-0">{stars}</div>;
};

export default Ratings;