// import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/courseApi";
import React, { FC, useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";  // Import component CourseCard để hiển thị thông tin khóa học
import "slick-carousel/slick/slick.css";  // Import các style mặc định của Slick Carousel
import "slick-carousel/slick/slick-theme.css";  // Import các style theme của Slick Carousel
import Loader from "@/app/components/Loader/Loader";  // Import Loader component để hiển thị khi dữ liệu đang được tải

type Props = {
    data: any;  // Dữ liệu khóa học được truyền vào từ props
    isLoading: boolean;  // Trạng thái loading của dữ liệu
};

const Courses: FC<Props> = ({ data, isLoading }) => {
    // const { data, isLoading } = useGetUsersAllCoursesQuery({});  // Dòng mã này bị comment đi, thay vào đó sẽ nhận dữ liệu qua props
    const [course, setCourse] = useState<any[]>([]);  // Khởi tạo state để lưu trữ danh sách các khóa học đã sắp xếp

    // useEffect hook để xử lý khi có sự thay đổi trong dữ liệu khóa học
    useEffect(() => {
        if (data?.courses) {  // Kiểm tra nếu dữ liệu khóa học có tồn tại
            // Sắp xếp các khóa học theo ngày tạo (newest first)
            const sortedCourses = [...data.courses].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            // Chỉ lấy 4 khóa học mới nhất
            setCourse(sortedCourses.slice(0, 4));
        }
    }, [data]);  // Mỗi khi dữ liệu khóa học thay đổi, sẽ thực hiện lại việc sắp xếp

    return (
        <div className="py-10">
            <div className="w-[90%] 800px:w-[80%] m-auto">
                <h1 className="text-center font-Poppins text-4xl font-bold mb-10 text-[#000] dark:text-white">
                    Expand Your Career <span className="text-gradient">Opportunity</span>
                </h1>
                <br />
                <br />
                {
                    isLoading ? <Loader /> :  // Nếu dữ liệu đang được tải, hiển thị Loader
                        <div
                            className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0"
                        >
                            {course &&  // Nếu có khóa học, thực hiện map qua các khóa học
                                course.map((item: any, index: number) => (
                                    <CourseCard item={item} key={index} />  // Hiển thị từng khóa học dưới dạng component CourseCard
                                ))}
                        </div>
                }
            </div>
        </div>
    );
};

export default Courses;