"use client";

import React, { FC } from "react";
import AdminProtected from "./../../hooks/adminProtected";
import Heading from "./../../utils/Heading";
import AdminSidebar from "./../../components/admin/sidebar/AdminSidebar";
import DashboardHero from "./../../components/admin/DashboardHero";
import EditCategories from "./../../components/admin/customization/EditCategories";

type Props = {};

const page: FC<Props> = (props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Elearning - Admin"
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Programming,MERN,Redux,Machine Learning"
        />
        <div className="flex h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
            <EditCategories />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;