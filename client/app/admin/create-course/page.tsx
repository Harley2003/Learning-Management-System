"use client";

import React, { FC } from "react";
import Heading from "./../../utils/Heading";
import AdminProtected from "./../../hooks/adminProtected";
import AdminSidebar from "./../../components/admin/sidebar/AdminSidebar";
import DashboardHeader from "./../../components/admin/DashboardHeader";
import CreateCourse from "../../components/admin/course/CreateCourse";

type Props = {};

const page: FC<Props> = (props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Admin - ELearning"
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Prograaming,MERN,Redux,Machine Learning"
        />
        <div className="flex">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHeader />
            <CreateCourse />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;