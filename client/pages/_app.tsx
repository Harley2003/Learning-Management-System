import { AppProps } from "next/app";

// Component MyApp là component tùy chỉnh để khởi tạo các trang trong ứng dụng Next.js
export default function MyApp({ Component, pageProps }: AppProps) {
  // Prop Component đại diện cho trang cụ thể đang được render
  // pageProps chứa các props khởi tạo cho trang (ví dụ: dữ liệu lấy từ getStaticProps hoặc getServerSideProps)

  return (
      // Render trang cụ thể với các pageProps đã được truyền vào
      <Component {...pageProps} />
  );
}