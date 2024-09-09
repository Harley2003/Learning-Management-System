"use client";

import React, { FC, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { styles } from "@/app/styles/style";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

type Props = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name!"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email!"),
  password: Yup.string()
    .required("Please enter your password!")
    .min(6, "Password must be at least 6 characters")
});

const Register: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: ""
    },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      console.log(name, email, password);
    }
  });

  const { values, errors, touched, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full px-[15px]">
      <h1 className={`${styles.title}`}>Join to ELearning</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label className={`${styles.label}`} htmlFor="email">
            Enter your Name
          </label>
          <input
            type="name"
            name="name"
            id="name"
            onChange={handleChange}
            value={values.name}
            className={`${errors.name && touched.name && "border-red-500"} ${
              styles.input
            }`}
            placeholder="johndoe"
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block">{errors.name}</span>
          )}
        </div>
        <div className="w-full mt-5 relative mb-1">
          <label className={`${styles.label}`} htmlFor="email">
            Enter your Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
            value={values.email}
            className={`${errors.email && touched.email && "border-red-500"} ${
              styles.input
            }`}
            placeholder="loginmail@gmail.com"
          />
          {errors.email && touched.email && (
            <span className="text-red-500 pt-2 block">{errors.email}</span>
          )}
        </div>
        <div className="w-full mt-5 relative mb-1">
          <label className={`${styles.label}`} htmlFor="password">
            Enter your Password
          </label>
          <input
            type={!show ? "password" : "text"}
            name="password"
            id="password"
            onChange={handleChange}
            value={values.password}
            placeholder="password!@%"
            className={`${
              errors.password && touched.password && "border-red-500"
            } ${styles.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
        </div>
        {errors.password && touched.password && (
          <span className="text-red-500 pt-2 block">{errors.password}</span>
        )}
        <div className="w-full mt-5">
          <input
            type="submit"
            value="Register"
            className={`${styles.button}`}
          />
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          Or join with
        </h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle size={30} className="cursor-pointer mr-2" />
          <AiFillGithub size={30} className="cursor-pointer ml-2" />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-white">
          Already have an account?{" "}
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute("Login")}
          >
            Login
          </span>
        </h5>
      </form>
      <br />
    </div>
  );
};

export default Register;
