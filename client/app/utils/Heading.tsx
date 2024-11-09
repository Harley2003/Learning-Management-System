import React, {FC} from "react";

// Định nghĩa kiểu Props cho component Heading
interface HeadProps {
    title: string; // Tiêu đề trang web
    description: string; // Mô tả trang web
    keywords: string; // Từ khóa cho SEO
}

// Component Heading sử dụng các Props như title, description và keywords để thiết lập các thẻ meta trong trang web
const Heading: FC<HeadProps> = ({title, description, keywords}) => {
    return (
        <>
            {/* Thiết lập tiêu đề của trang */}
            <title>{title}</title>
            {/* Thiết lập meta viewport để điều chỉnh trang web cho thiết bị di động */}
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            {/* Thiết lập meta description cho SEO */}
            <meta name="description" content={description}/>
            {/* Thiết lập meta keywords cho SEO */}
            <meta name="keywords" content={keywords}/>
        </>
    );
};

export default Heading;