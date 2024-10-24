import {useGetUsersAllCoursesQuery} from "@/redux/features/courses/courseApi";
import React, {FC, useEffect, useState} from "react";
import CourseCard from "../Course/CourseCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loader from "@/app/components/Loader/Loader";

type Props = {};

const Courses: FC<Props> = (props) => {
    const {data, isLoading} = useGetUsersAllCoursesQuery({});
    const [course, setCourse] = useState<any[]>([]);

    useEffect(() => {
        if (data?.courses) {
            const sortedCourses = [...data.courses].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setCourse(sortedCourses.slice(0, 4));
        }
    }, [data]);

    return (
        <div className="py-10">
            <div className="w-[90%] 800px:w-[80%] m-auto">
                <h1 className="text-center font-Poppins text-4xl font-bold mb-10 text-[#000] dark:text-white">
                    Expand Your Career <span className="text-gradient">Opportunity</span>
                </h1>
                <br/>
                <br/>
                {
                    isLoading ? <Loader/> :
                        <div
                            className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
                            {course &&
                                course.map((item: any, index: number) => (
                                    <CourseCard item={item} key={index}/>
                                ))}
                        </div>
                }
            </div>
        </div>
    );
};

export default Courses;
