"use client";

import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { redirect } from "next/navigation";
import React, { FC, useEffect } from "react";
import Loader from "./../../components/loader/Loader";
import CourseContent from "@/app/components/course/CourseContent";

type Props = {
  params: any;
};

const Page: FC<Props> = ({ params }) => {
  const id = params.id;
  const { data, isLoading, error } = useLoadUserQuery(undefined, {});
  useEffect(() => {
    if (data) {
      const isPurchased = data.user.courses.find(
        (item: any) => item._id === id
      );
      if (!isPurchased) {
        redirect("/");
      }

      if (error) {
        redirect("/");
      }
    }
  }, [data, error, id]);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <CourseContent id={id} user={data.user} />
        </div>
      )}
    </>
  );
};

export default Page;