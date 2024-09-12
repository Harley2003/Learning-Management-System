"use client";

import React, { FC, useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Protected from "../hooks/useProtected";
import Profile from "../components/profile/Profile";
import { useSelector } from "react-redux";

type Props = {};

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<number>(5);
  const [route, setRoute] = useState<string>("Login");
  const { user } = useSelector((state: any) => state.auth);

  return (
    <div>
      <Protected> 
        <Heading
          title={`Profile - ELearning`}
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
        <Profile user={user} />
      </Protected>
    </div>
  );
};

export default Page;
