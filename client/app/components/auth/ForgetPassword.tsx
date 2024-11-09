import React, {FC, useEffect, useState} from 'react';
import {styles} from "@/app/styles/style";
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useForgetPasswordMutation} from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
    setOpen: (open: boolean) => void;
    setRoute: (route: string) => void;
};

const ForgetPassword: FC<Props> = ({setOpen, setRoute}) => {
    const [forgetPassword, {isLoading, isSuccess, error, data}] = useForgetPasswordMutation();

    useEffect(() => {
        if (isSuccess) {
            localStorage.setItem("resetToken", data.resetToken);
            setRoute("ResetPassword");
        }

        if (error && "data" in error) {
            const errorData = error as any;
            setRoute("Login");
            setOpen(false);
            toast.error(errorData.data.message);
        }
    }, [isSuccess, error, data, setRoute, setOpen]);

    const formik = useFormik({
        initialValues: {
            email: ""
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Email is required")
        }),
        onSubmit: async (values) => {
            try {
                await forgetPassword({email: values.email}).unwrap();
            } catch (error: any) {
                console.error("Failed to send email:", error);
            }
        }
    });

    return (
        <div className="w-full px-[15px]">
            <h1 className={`${styles.title}`}>Forgot Password</h1>
            <form onSubmit={formik.handleSubmit}>
                <label className={`${styles.label}`} htmlFor="email">
                    Enter your Email
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={`${formik.errors.email && formik.touched.email ? "border-red-500" : ""} ${styles.input}`}
                    placeholder="Enter your email"
                />
                {formik.errors.email && formik.touched.email && (
                    <span className="text-red-500 pt-2 block">{formik.errors.email}</span>
                )}
                <div className="w-full mt-5">
                    <input
                        type="submit"
                        value={isLoading ? "Sending..." : "Send Reset Link"}
                        className={`${styles.button} ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
                        disabled={isLoading}
                    />
                </div>
                <br/>
                <h5 className="text-center pt-4 font-Poppins text-[14px] text-white">
                    Don&apos;t have an account?
                    <span
                        className="text-[#2190ff] pl-1 cursor-pointer hover: underline"
                        onClick={() => setRoute("Register")}
                    >
                        Register
                    </span>
                </h5>
                <br/>
            </form>
        </div>
    );
};

export default ForgetPassword;
