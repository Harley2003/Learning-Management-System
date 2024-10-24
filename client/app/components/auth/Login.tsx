import React, {FC, useEffect, useState} from "react";
import * as Yup from "yup";
import {useFormik} from "formik";
import {styles} from "@/app/styles/style";
import {
    AiOutlineEye,
    AiOutlineEyeInvisible
} from "react-icons/ai";
import {useLoginMutation} from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
    setOpen: (open: boolean) => void;
    setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
    email: Yup.string()
        .email("Please enter a valid email address.")
        .required("Email is required.")
        .trim(),
    password: Yup.string()
        .required("Password is required.")
        .min(8, "Password must be at least 8 characters long.")
        .trim()
});

const Login: FC<Props> = ({setRoute, setOpen}) => {
    const [show, setShow] = useState(false);
    const [login, {isSuccess, error}] = useLoginMutation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isSuccess) {
            toast.success("Login successful!");
            setOpen(false);
        }

        if (error && "data" in error) {
            const errorData = error as any;
            toast.error(errorData.data.message);
        }
    }, [isSuccess, setOpen, error]);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: schema,
        onSubmit: async ({email, password}) => {
            setLoading(true);
            try {
                await login({email, password});
            } catch (error: any) {
                console.log("Login error: " + error);
            } finally {
                setLoading(false);
            }
        }
    });

    const {values, errors, touched, handleChange, handleSubmit} = formik;

    return (
        <div className="w-full px-[15px]">
            <h1 className={`${styles.title}`}>Login with ELearning</h1>
            <form onSubmit={handleSubmit}>
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
                    placeholder=""
                />
                {errors.email && touched.email && (
                    <span className="text-red-500 pt-2 block">{errors.email}</span>
                )}
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
                        value={loading ? "Logging in..." : "Login"}
                        className={`${styles.button} ${
                            loading ? "cursor-not-allowed opacity-50" : ""
                        }`}
                        disabled={loading}
                    />
                </div>
                <br/>
                <div className="text-center mt-4">
                    <span
                        className="text-[#2190ff] cursor-pointer text-[15px] inline-block hover:underline"
                        onClick={() => setRoute("ForgetPassword")}
                    >
                    Forgot your password?
                    </span>
                    <div className="mt-4 mb-2">
                        <h5 className="font-Poppins text-[14px] dark:text-white text-black">Or</h5>
                    </div>
                    <h5 className="font-Poppins text-[14px] dark:text-white text-black">
                        Don&apos;t have an account?
                        <span
                            className="text-[#2190ff] pl-1 cursor-pointer hover:underline transition duration-300 ease-in-out transform hover:scale-105"
                            onClick={() => setRoute("Register")}
                        >
                        Register
                        </span>
                    </h5>
                </div>
            </form>
            <br/>
        </div>
    )
        ;
};

export default Login;