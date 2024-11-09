"use client";

import React, {FC, useState} from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Protected from "../hooks/useProtected";
import {useSelector} from "react-redux";
import Footer from "../components/Footer";
import Profile from "@/app/components/Profile/Profile";

type Props = {};

const Page: FC<Props> = (props) => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(5);
    const [route, setRoute] = useState("Login");
    const {user} = useSelector((state: any) => state.auth);

    return (
        <Protected>
            <Heading
                title="Profile - ELearning"
                description="ELearning is a platform for students to learn and get help from teachers"
                keywords="Prograaming,MERN,Redux,Machine Learning"
            />
            <Header
                open={open}
                setOpen={setOpen}
                activeItem={activeItem}
                route={route}
                setRoute={setRoute}
            />
            <Profile user={user}/>
            <Footer/>
        </Protected>
    );
};

export default Page;
