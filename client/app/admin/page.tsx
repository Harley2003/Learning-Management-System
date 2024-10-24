"use client";

import React, {FC} from "react";
import Heading from "../utils/Heading";
import AdminSidebar from "../components/Admin/Sidebar/AdminSidebar";
import AdminProtected from "../hooks/adminProtected";
import DashboardHero from "../components/Admin/DashboardHero";
import {useLoadUserQuery} from "@/redux/features/api/apiSlice";
import { useSelector } from "react-redux";

type Props = {};

const Page: FC<Props> = (props) => {
    // const {data} = useLoadUserQuery(undefined);
    const {user} = useSelector((state: any) => state.auth);
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="Admin - ELearning"
                    description="ELearning is a platform for students to learn and get help from teachers"
                    keywords="Prograaming,MERN,Redux,Machine Learning"
                />
                <div className="flex min-h-screen">
                    <div className="1500px:w-[16%] w-1/5">
                        <AdminSidebar data={user}/>
                    </div>
                    <div className="w-[85%]">
                        <DashboardHero isDashboard={true}/>
                    </div>
                </div>
            </AdminProtected>
        </div>
    );
};

export default Page;
