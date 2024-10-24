"use client";

import {useLoadUserQuery} from "@/redux/features/api/apiSlice";
import {redirect} from "next/navigation";
import React, {FC, useEffect} from "react";
import Loader from "../../components/Loader/Loader";
import CourseContent from "@/app/components/Course/CourseContent";

type Props = {
    params: any;
};

const Page: FC<Props> = ({params}) => {
    const id = params.id;
    const {data, isLoading, error} = useLoadUserQuery({});
    useEffect(() => {
        if (error) {
            redirect("/");
        }
    }, [error]);
    return (
        <>
            {isLoading ? (
                <Loader/>
            ) : (
                <>
                    <CourseContent id={id} user={data.user}/>
                </>
            )}
        </>
    );
};

export default Page;
