import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/courseApi";
import React, { FC, useEffect, useState } from "react";
import CourseCard from "../course/CourseCard";

type Props = {};

const Courses: FC<Props> = (props) => {
  const { data, isLoading } = useGetUsersAllCoursesQuery({});
  const [course, setCourse] = useState<any[]>([]);
  useEffect(() => {
    setCourse(data?.courses);
  }, [data]);
  return (
    <div>
      <div className="w-[90%] 800px:w-[80%] m-auto">
        <h1 className="text-center font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white text-[#000] 800px:!leading-[60px] font-[700] tracking-tight">
          Expand Your Career <span className="text-gradient">Opportunity</span>
          <br />
          Opportunity With Our Career
        </h1>
        <br />
        <br />
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
          {course &&
            course.map((item: any, index: number) => (
              <CourseCard item={item} key={index} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
