import React, {FC, useState} from 'react';
import {styles} from "@/app/styles/style";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import toast from "react-hot-toast";
import {useResetPasswordMutation} from "@/redux/features/auth/authApi";

type Props = {
    setOpen: (open: boolean) => void;
    setRoute: (route: string) => void;
};

const ResetPassword: FC<Props> = ({setOpen, setRoute}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [values, setValues] = useState({password: "", confirmPassword: ""});
    const [errors, setErrors] = useState({password: "", confirmPassword: ""});
    const [resetPassword, {isLoading}] = useResetPasswordMutation();

    // Retrieve the token from localStorage
    const getToken = localStorage.getItem("resetToken");

    // Check if the token is valid
    if (!getToken) {
        toast.error("Invalid or expired token");
        setOpen(false); // Optionally close the reset form
        setRoute("Login");
        return null; // Prevent the component from rendering further
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({...values, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (values.password !== values.confirmPassword) {
            setErrors({...errors, confirmPassword: "Passwords do not match"});
            return;
        }

        try {
            // Pass the token correctly based on the expected structure
            await resetPassword({token: getToken, data: {password: values.password}}).unwrap();
            localStorage.removeItem("resetToken");
            toast.success("Password reset successfully!");
            setRoute("Login");
            setOpen(false);
        } catch (error: any) {
            toast.error("Failed to reset password: " + error.message);
        }
    };

    return (
        <div className="w-full px-[15px]">
            <h1 className={styles.title}>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <label className={styles.label} htmlFor="password">New Password</label>
                <div className="relative">
                    <input
                        type={!showPassword ? "password" : "text"}
                        name="password"
                        id="password"
                        onChange={handleChange}
                        value={values.password}
                        className={errors.password ? "border-red-500" : "" + styles.input}
                        placeholder="Enter new password"
                    />
                    {!showPassword ? (
                        <AiOutlineEye onClick={() => setShowPassword(true)}
                                      className="absolute right-3 top-[1.3rem] cursor-pointer"/>
                    ) : (
                        <AiOutlineEyeInvisible onClick={() => setShowPassword(false)}
                                               className="absolute right-3 top-[1.3rem] cursor-pointer"/>
                    )}
                </div>
                <br/>
                <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                <div className="relative">
                    <input
                        type={!showConfirmPassword ? "password" : "text"}
                        name="confirmPassword"
                        id="confirmPassword"
                        onChange={handleChange}
                        value={values.confirmPassword}
                        className={errors.confirmPassword ? "border-red-500" : "" + styles.input}
                        placeholder="Confirm your password"
                    />
                    {!showConfirmPassword ? (
                        <AiOutlineEye onClick={() => setShowConfirmPassword(true)}
                                      className="absolute right-3 top-[1.3rem] cursor-pointer"/>
                    ) : (
                        <AiOutlineEyeInvisible onClick={() => setShowConfirmPassword(false)}
                                               className="absolute right-3 top-[1.3rem] cursor-pointer"/>
                    )}
                </div>
                {errors.confirmPassword && <span className="text-red-500 pt-2 block">{errors.confirmPassword}</span>}
                <div className="w-full mt-5">
                    <input
                        type="submit"
                        value={isLoading ? "Resetting..." : "Reset Password"}
                        className={`${styles.button} ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
                        disabled={isLoading}
                    />
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;
