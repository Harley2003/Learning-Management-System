import type { Config } from "tailwindcss";

const config: Config = {
  // Định nghĩa các tệp nội dung để quét các tên lớp
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",   // Thư mục Pages
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Thư mục Components
    "./app/**/*.{js,ts,jsx,tsx,mdx}"        // Thư mục App
  ],

  // Kích hoạt chế độ dark mode theo chiến lược 'class' (chế độ tối được kích hoạt khi thêm class 'dark')
  darkMode: ["class"],

  theme: {
    extend: {
      // Các font chữ tùy chỉnh (sử dụng biến CSS để dễ dàng thay đổi)
      fontFamily: {
        Poppins: ["var(--font-Poppins)"],     // Font Poppins tùy chỉnh
        Josefin: ["var(--font-Josefin)"],     // Font Josefin tùy chỉnh
        Cursive: ["var(--font-Cursive)"],     // Font Cursive tùy chỉnh
      },

      // Các gradient nền tùy chỉnh
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",  // Gradient vòng tròn
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"  // Gradient hình nón
      },

      // Các điểm ngắt màn hình (breakpoints) cho thiết kế đáp ứng (responsive design)
      screens: {
        "1500px": "1500px", // Điểm ngắt màn hình cho chiều rộng 1500px
        "1400px": "1400px", // Điểm ngắt màn hình cho chiều rộng 1400px
        "1300px": "1300px", // Điểm ngắt màn hình cho chiều rộng 1300px
        "1200px": "1200px", // Điểm ngắt màn hình cho chiều rộng 1200px
        "1100px": "1100px", // Điểm ngắt màn hình cho chiều rộng 1100px
        "1000px": "1000px", // Điểm ngắt màn hình cho chiều rộng 1000px
        "900px": "900px",   // Điểm ngắt màn hình cho chiều rộng 900px
        "800px": "800px",   // Điểm ngắt màn hình cho chiều rộng 800px
        "700px": "700px",   // Điểm ngắt màn hình cho chiều rộng 700px
        "600px": "600px",   // Điểm ngắt màn hình cho chiều rộng 600px
        "500px": "500px",   // Điểm ngắt màn hình cho chiều rộng 500px
        "400px": "400px",   // Điểm ngắt màn hình cho chiều rộng 400px
        "300px": "300px"    // Điểm ngắt màn hình cho chiều rộng 300px
      }
    }
  },

  // Các plugin tùy chỉnh có thể được thêm vào đây
  plugins: []
};

export default config;