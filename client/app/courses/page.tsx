"use client";

import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/courseApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useSearchParams } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import Loader from "../components/loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import { styles } from "../styles/style";
import CourseCard from "../components/course/CourseCard";

type Props = {};

const Page: FC<Props> = (props) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  const { data: dataCategory } = useGetHeroDataQuery("Categories", {});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (category === "All") {
      setCourses(data?.courses);
    }

    if (category !== "All") {
      setCourses(
        data?.courses.filter((item: any) => item.categories === category)
      );
    }

    if (search) {
      setCourses(
        data?.courses.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [category, data, search]);

  const categories = dataCategory?.layout.categories;

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />
          <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh]">
            <Heading
              title="All course - Elearning"
              description="Elearning is a programming community"
              keywords="Programming,MERN,Redux,Machine Learning"
            />
          </div>
          <br />
          <div className="w-full flex items-center flex-wrap">
            <div
              className={`${
                category === "All" ? "bg-[crimson]" : "bg-[#5050cb]"
              } h-[35px] m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
              onClick={() => setCategory("All")}
            >
              All
            </div>
            {categories &&
              categories.map((item: any, index: number) => (
                <div key={index}>
                  <div
                    className={`${
                      category === item.title ? "bg-[crimson]" : "bg-[#5050cb]"
                    } h-[35px] m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`}
                    onClick={() => setCategory(item.title)}
                  >
                    {item.title}
                  </div>
                </div>
              ))}
          </div>
          {courses && courses.length === 0 && (
            <p
              className={`${styles.label} flex items-center justify-center min-h-[50vh]`}
            >
              {search
                ? "No courses found!"
                : "No courses found in this caregory. Please try another one!"}
            </p>
          )}
          <br />
          <br />
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
            {courses &&
              courses.map((item: any, index: number) => (
                <CourseCard item={item} key={index} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
