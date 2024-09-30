"use client";

import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/courseApi";
import React, { FC, useEffect, useState } from "react";
import CourseCard from "../Course/CourseCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

type Props = {};

const Courses: FC<Props> = (props) => {
  const { data, isLoading } = useGetUsersAllCoursesQuery({});
  const [course, setCourse] = useState<any[]>([]);

  useEffect(() => {
    setCourse(data?.courses);
  }, [data]);

  // Cấu hình cho slider
  const settingsTop = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const settingsBottom = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    rtl: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="py-10">
      <div className="w-[90%] 800px:w-[80%] m-auto">
        <h1 className="text-center font-Poppins text-4xl font-bold mb-10 text-[#000] dark:text-white">
          Expand Your Career <span className="text-gradient">Opportunity</span>
        </h1>

        {/* Slider cho hàng trên */}
        <Slider {...settingsTop} className="mb-10">
          {course &&
            course.slice(0, 4).map((item: any, index: number) => (
              <div key={index} className="px-2">
                {" "}
                {/* Thêm khoảng cách ở đây */}
                <CourseCard item={item} />
              </div>
            ))}
        </Slider>

        {/* Slider cho hàng dưới */}
        <Slider {...settingsBottom}>
          {course &&
            course.slice(4, 8).map((item: any, index: number) => (
              <div key={index} className="px-2">
                {" "}
                {/* Thêm khoảng cách ở đây */}
                <CourseCard item={item} />
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

export default Courses;
