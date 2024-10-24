import React, {FC, useEffect, useState} from "react";
import * as Yup from "yup";
import {useFormik} from "formik";
import {styles} from "@/app/styles/style";
import {
    AiFillGithub,
    AiOutlineEye,
    AiOutlineEyeInvisible
} from "react-icons/ai";
import {FcGoogle} from "react-icons/fc";
import {useRegisterMutation} from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
    setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
    name: Yup.string()
        .matches(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, apostrophes, and hyphens")
        .min(2, "Name must be at least 2 characters")
        .max(10, "Name must be at most 10 characters")
        .required("Please enter your name!")
        .trim(),
    email: Yup.string()
        .email("Please enter a valid email address.")
        .required("Please enter your email!")
        .trim(),
    password: Yup.string()
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[a-z]/, "Must contain at least one lowercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .matches(/[!@#$%^&*]/, "Must contain at least one special character")
        .min(8, "Password must be at least 8 characters")
        .required("Please enter your password!")
        .trim()
});

const Register: FC<Props> = ({setRoute}) => {
    const [show, setShow] = useState(false);
    const [register, {error, data, isSuccess, isLoading}] = useRegisterMutation();

    useEffect(() => {
        if (isSuccess) {
            const message = data?.message || "Register successful!";
            toast.success(message);
            setRoute("Verification");
        }

        if (error && "data" in error) {
            const errorData = error as any;
            toast.error(errorData.data.message);
        }
    }, [isSuccess, error, data?.message, setRoute]);

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: ""
        },
        validationSchema: schema,
        onSubmit: async ({name, email, password}) => {
            const data = {
                name,
                email,
                password
            };

            try {
                await register(data);
            } catch (error: any) {
                console.error("Failed to register:", error);
            }
        }
    });

    const {values, errors, touched, handleChange, handleSubmit} = formik;

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
                        placeholder=""
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
                        type="text"
                        name="email"
                        id="email"
                        onChange={handleChange}
                        value={values.email}
                        className={`${errors.email && touched.email && "border-red-500"} ${
                            styles.input
                        }`}
                        placeholder=""
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
                        placeholder=""
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
                        value={isLoading ? "Registration..." : "Register"}
                        className={`${styles.button}`}
                        disabled={isLoading}
                    />
                </div>
                <br/>
                <h5 className="text-center pt-4 font-Poppins text-[14px] text-white">
                    Already have an account?
                    <span
                        className="text-[#2190ff] pl-1 cursor-pointer hover:underline"
                        onClick={() => setRoute("Login")}
                    >
                    Login
                    </span>
                </h5>
            </form>
            <br/>
        </div>
    );
};

export default Register;
