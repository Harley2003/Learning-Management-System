import { useGetCourseDetailsQuery } from "@/redux/features/courses/courseApi";
import React, { FC, useState } from "react";
import Loader from "../loader/Loader";
import Heading from "./../../utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";

type Props = {
  id: string;
};

const CourseDetailsPage: FC<Props> = ({ id }) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetCourseDetailsQuery(id);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Heading
            title={data.course.name + "- ELearning"}
            description="ELearning is a programming community which is developed by yang yang for helping programmers"
            keywords={data?.course?.tags}
          />
          <Header
            open={open}
            setOpen={setOpen}
            activeItem={1}
            route={route}
            setRoute={setRoute}
          />
          <CourseDetails data={data.course} />
          <Footer />
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;
