import React, {FC, useState} from "react";
import {BsChevronDown, BsChevronUp} from "react-icons/bs";  // Import biểu tượng mũi tên
import {MdOutlineOndemandVideo} from "react-icons/md";  // Import biểu tượng video

type Props = {
    data: any;  // Dữ liệu về các video khóa học
    activeVideo?: number;  // Video đang được chọn (nếu có)
    setActiveVideo?: any;  // Hàm để thay đổi video đang hoạt động
    isDemo?: boolean;  // Cờ kiểm tra nếu đây là chế độ demo
};

// Component CourseContentList, hiển thị danh sách các video khóa học theo từng phần (section)
const CourseContentList: FC<Props> = ({
                                          data,
                                          activeVideo,
                                          setActiveVideo,
                                          isDemo
                                      }) => {
    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set<string>());  // State để kiểm soát phần nào đang được mở

    // Lấy các phần video duy nhất từ dữ liệu khóa học
    const videoSections: string[] = Array.from(new Set<string>(data?.map((item: any) => item.videoSection)));

    let totalCount: number = 0;

    // Hàm để chuyển đổi giữa việc hiển thị hoặc ẩn phần nội dung
    const toggleSection = (section: string) => {
        const newVisibleSections = new Set(visibleSections);
        if (newVisibleSections.has(section)) {
            newVisibleSections.delete(section);
        } else {
            newVisibleSections.add(section);
        }
        setVisibleSections(newVisibleSections);
    };

    return (
        <div className={`mt-[15px] w-full ${!isDemo && "ml-[-30px] min-h-screen sticky top-24 left-0 z-30"}`}>
            {videoSections.map((section: string, sectionIndex: number) => {
                const isSectionVisible = visibleSections.has(section);  // Kiểm tra phần này có đang hiển thị không

                // Lọc các video thuộc phần này
                const sectionVideos: any[] = data.filter((item: any) => item.videoSection === section);

                const sectionVideoCount: number = sectionVideos.length;  // Đếm số lượng video trong phần này
                const sectionVideoLength: number = sectionVideos.reduce((totalLength: number, item: any) => totalLength + item.videoLength, 0);  // Tổng thời gian của tất cả video
                const sectionStartIndex: number = totalCount;
                totalCount += sectionVideoCount;

                const sectionContentHours: number = sectionVideoLength / 60;  // Tính số giờ tổng của phần này

                return (
                    <div className={`${!isDemo && "border-b border-[#0000001c] dark:border-[#ffffff8e] pb-2"}`} key={section}>
                        <div className="w-full flex">
                            {/* Tiêu đề phần video */}
                            <div className="w-full flex justify-between items-center">
                                <h2 className="text-[22px] text-black dark:text-white">{section}</h2>
                                <button
                                    className="mr-4 cursor-pointer text-black dark:text-white"
                                    onClick={() => toggleSection(section)}  // Gọi hàm toggle để ẩn/hiện phần video
                                >
                                    {isSectionVisible ? <BsChevronUp size={20}/> : <BsChevronDown size={20}/>}
                                </button>
                            </div>
                        </div>
                        {/* Hiển thị số lượng bài học và tổng thời gian của phần */}
                        <h5 className="text-black dark:text-white">
                            {sectionVideoCount} Lessons ·{" "}
                            {sectionVideoLength < 60
                                ? sectionVideoLength
                                : sectionContentHours.toFixed(2)}{" "}
                            {sectionVideoLength > 60 ? "hours" : "minutes"}
                        </h5>
                        <br/>
                        {/* Nếu phần đang hiển thị, hiển thị danh sách các video */}
                        {isSectionVisible && (
                            <div className="w-full">
                                {sectionVideos.map((item: any, index: number) => {
                                    const videoIndex: number = sectionStartIndex + index;  // Tính chỉ số video trong danh sách toàn bộ khóa học
                                    const contentLength: number = item.videoLength / 60;  // Chuyển đổi độ dài video sang giờ
                                    return (
                                        <div
                                            className={`w-full ${videoIndex === activeVideo ? "bg-slate-800" : ""} ${!isDemo && "cursor-pointer"} transition-all p-2`}
                                            key={item._id}
                                            onClick={() => isDemo ? null : setActiveVideo(videoIndex)}  // Thay đổi video đang hoạt động khi nhấp vào
                                        >
                                            <div className="flex items-start">
                                                <div>
                                                    <MdOutlineOndemandVideo size={25} className="mr-2" color="#1cdada" />  {/* Biểu tượng video */}
                                                </div>
                                                <h1 className="text-[18px] inline-block break-words text-black dark:text-white">
                                                    {item.title}
                                                </h1>
                                            </div>
                                            {/* Hiển thị thời gian video */}
                                            <h5 className="pl-8 text-black dark:text-white">
                                                {item.videoLength > 60 ? contentLength.toFixed(2) : item.videoLength}{" "}
                                                {item.videoLength > 60 ? "hours" : "minutes"}
                                            </h5>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default CourseContentList;