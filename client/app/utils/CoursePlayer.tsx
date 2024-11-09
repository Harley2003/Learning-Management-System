import React, {FC, useEffect, useState} from "react";
import axios from "axios";
import Head from "next/head";

// Định nghĩa kiểu Props mà component CoursePlayer nhận vào
type Props = {
    videoUrl: string; // URL của video cần phát
    title: string;    // Tiêu đề của video
};

const CoursePlayer: FC<Props> = ({videoUrl, title}) => {
    // State để lưu URL nhúng (embed URL) sau khi lấy từ API
    const [embedUrl, setEmbedUrl] = useState("");

    // useEffect để gọi API khi videoUrl thay đổi
    useEffect(() => {
        // Hàm gọi API để lấy URL nhúng cho video
        const fetchVideo = async () => {
            try {
                // Gửi yêu cầu POST tới API để lấy video URL
                const response = await axios.post(`http://localhost:8000/api/v1/generateVideoUrl`, {
                    videoUrl, // Truyền videoUrl để API xử lý
                });
                // Lấy URL nhúng từ phản hồi của API và cập nhật vào state
                const {link} = response.data;
                setEmbedUrl(link);
            } catch (error) {
                // Nếu có lỗi xảy ra, in ra lỗi
                console.error("Error fetching video:", error);
            }
        };

        fetchVideo(); // Gọi hàm fetchVideo để lấy video URL
    }, [videoUrl]); // Hook useEffect sẽ chạy lại khi videoUrl thay đổi

    return (
        <>
            {/* Cập nhật tiêu đề của trang với tiêu đề video */}
            <Head>
                <title>{title}</title>
                {/* Nhúng script Vimeo player API để sử dụng iframe */}
                <script src="https://player.vimeo.com/api/player.js" async></script>
            </Head>
            <div style={{padding: "56.25% 0 0 0", position: "relative"}}>
                {/* Nhúng video vào iframe sử dụng URL nhúng đã được trả về */}
                <iframe
                    src={embedUrl}                          // URL nhúng video
                    frameBorder="0"                         // Bỏ viền xung quanh iframe
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write" // Cho phép các tính năng như autoplay, fullscreen
                    style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}} // Căn chỉnh iframe
                    title={title}                          // Tiêu đề của iframe (thường là tiêu đề video)
                ></iframe>
            </div>
        </>
    );
};

export default CoursePlayer;