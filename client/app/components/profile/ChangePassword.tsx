import { styles } from "@/app/styles/style";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type Props = {};

const ChangePassword: FC<Props> = (props) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

  const handlerChangePassword = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Password don't match!");
    } else {
      await updatePassword({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password changed successfully!");
    }

    if (error && "data" in error) {
      const errorData = error as any;
      toast.error(errorData.data.message);
    }
  }, [isSuccess, error]);

  return (
    <div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
      <h1 className="block text-[25px] 800px:text-[30px] font-Poppins text-center font-[500] dark:text-[#fff] text-black pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form
          onSubmit={handlerChangePassword}
          className="flex flex-col items-center"
        >
          <div className="w-[100%] 800px:w-[60%] mt-5 relative">
            <label
              htmlFor="oldPassword"
              className="block pb-2 dark:text-[#fff] text-black"
            >
              Enter your old password
            </label>
            <input
              type={!showOldPassword ? "password" : "text"}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 dark:text-[#fff] text-black`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            {!showOldPassword ? (
              <AiOutlineEyeInvisible
                className="absolute bottom-3 right-[3.5rem] z-1 cursor-pointer"
                size={20}
                onClick={() => setShowOldPassword(true)}
              />
            ) : (
              <AiOutlineEye
                className="absolute bottom-3 right-[3.5rem] z-1 cursor-pointer"
                size={20}
                onClick={() => setShowOldPassword(false)}
              />
            )}
          </div>
          <div className="w-[100%] 800px:w-[60%] mt-2 relative">
            <label
              htmlFor="newPassword"
              className="block pb-2 dark:text-[#fff] text-black"
            >
              Enter your new password
            </label>
            <input
              type={!showNewPassword ? "password" : "text"}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 dark:text-[#fff] text-black`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {!showNewPassword ? (
              <AiOutlineEyeInvisible
                className="absolute bottom-3 right-[3.5rem] z-1 cursor-pointer"
                size={20}
                onClick={() => setShowNewPassword(true)}
              />
            ) : (
              <AiOutlineEye
                className="absolute bottom-3 right-[3.5rem] z-1 cursor-pointer"
                size={20}
                onClick={() => setShowNewPassword(false)}
              />
            )}
          </div>
          <div className="w-[100%] 800px:w-[60%] mt-2 relative">
            <label
              htmlFor="confirmPassword"
              className="block pb-2 dark:text-[#fff] text-black"
            >
              Enter your confirm password
            </label>
            <input
              type={!showConfirmPassword ? "password" : "text"}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0 dark:text-[#fff] text-black`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {!showConfirmPassword ? (
              <AiOutlineEyeInvisible
                className="absolute bottom-3 right-[3.5rem] z-1 cursor-pointer"
                size={20}
                onClick={() => setShowConfirmPassword(true)}
              />
            ) : (
              <AiOutlineEye
                className="absolute bottom-3 right-[3.5rem] z-1 cursor-pointer"
                size={20}
                onClick={() => setShowConfirmPassword(false)}
              />
            )}
          </div>
          <div className="w-[100%] 800px:w-[60%] mt-2">
            <input
              type="submit"
              value="Update"
              className={`w-[95%] h-[40px] border border-[#37a39a] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer`}
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
