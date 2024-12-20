import Ratings from "@/app/utils/Ratings";
import React, {FC, useEffect, useState} from "react";
import {IoCheckmarkDoneOutline, IoCloseOutline} from "react-icons/io5";
import {format} from "timeago.js";
import CoursePlayer from "../../utils/CoursePlayer";
import {styles} from "@/app/styles/style";
import Link from "next/link";
import CourseContentList from "./CourseContentList";
import CheckOutForm from "../Payment/CheckOutForm";
import {Elements} from "@stripe/react-stripe-js";
import Image from "next/image";
import avatarDefault from "@/public/assests/avatar.png";
import {VscVerifiedFilled} from "react-icons/vsc";
import {useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import {useCreateOrderFreeMutation} from "@/redux/features/orders/orderApi";
import toast from "react-hot-toast";

type Props = {
    data: any;
    // setOpen: any;
    // setRoute: any;
    stripePromise: any;
    clientSecret: string;
};

const CourseDetails: FC<Props> = ({
                                      data,
                                      // setOpen: openAuthModal,
                                      // setRoute,
                                      stripePromise,
                                      clientSecret
                                  }) => {
    const {user: dataUser} = useSelector((state: any) => state.auth);
    const [user, setUser] = useState<any>();
    const [open, setOpen] = useState(false);
    const [createOrderFree, {isSuccess}] = useCreateOrderFreeMutation();
    const router = useRouter();
    const discountPercentenge =
        ((data?.estimatedPrice - data?.price) / data?.estimatedPrice) * 100;
    const discountPercentengePrice = discountPercentenge.toFixed(0);
    const isPurchased =
        user && user?.courses?.find((item: any) => item._id === data._id);
    const handleOrder = async () => {
        if (data?.price <= 0 && user) {
            await createOrderFree({courseId: data._id});
        } else {
            if (user) {
                setOpen(true);
            } else {
                router.push("/");
                toast("You are not logged in!", {
                    duration: 1000,
                    icon: '⚠️',
                });
            }
        }
    };

    useEffect(() => {
        setUser(dataUser);
    }, [dataUser]);

    useEffect(() => {
        if (isSuccess && isPurchased) {
            router.push(`/course-access/${data._id}`);
        }
    }, [isSuccess, router, data._id, isPurchased]);

    return (
        <div>
            <div className="w-[90%] 800px:w-[90%] m-auto py-5">
                <div className="w-full flex flex-col-reverse 800px:flex-row">
                    <div className="w-full 800px:w-[65%] 800px:pr-5">
                        <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                            {data.name}
                        </h1>
                        <div className="flex items-center justify-between pt-3">
                            <div className="flex items-center">
                                <Ratings rating={data.ratings} isDemo={true}/>
                                <h5 className="text-black dark:text-white">
                                    {
                                        "( " + (Number.isInteger(data?.ratings)
                                            ? data?.ratings.toFixed(1)
                                            : data?.ratings.toFixed(2)) + " / 5 Ratings )"
                                    }
                                </h5>
                            </div>
                            <h5 className="text-black dark:text-white">
                                {data.purchased + " Students"}
                            </h5>
                        </div>
                        <br/>
                        <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                        What you will learn from this course?
                        </h1>
                        <div>
                            {data?.benefits?.map((item: any, index: number) => (
                                <div
                                    className="w-full flex 800px:items-center py-2"
                                    key={index}
                                >
                                    <div className="w-[15px] mr-1">
                                        <IoCheckmarkDoneOutline
                                            size={20}
                                            className="text-black dark:text-white"
                                        />
                                    </div>
                                    <p className="pl-2 text-black dark:text-white">
                                        {item.title}
                                    </p>
                                </div>
                            ))}
                            <br/>
                            <br/>
                        </div>
                        <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                            What are the prerequisites for starting this course?
                        </h1>
                        {data.prerequisites?.map((item: any, index: number) => (
                            <div className="w-full flex 800px:items-center py-2" key={index}>
                                <div className="w-[15px] mr-1">
                                    <IoCheckmarkDoneOutline
                                        size={20}
                                        className="text-black dark:text-white"
                                    />
                                </div>
                                <p className="pl-2 text-black dark:text-white">{item.title}</p>
                            </div>
                        ))}
                        <br/>
                        <br/>
                        <div>
                            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                                Course Overview
                            </h1>
                            <CourseContentList data={data?.courseData} isDemo={true}/>
                        </div>
                        <br/>
                        <br/>
                        {/* Course Description */}
                        <div className="w-full">
                            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                                Course Description
                            </h1>
                            <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                                {data.description}
                            </p>
                        </div>
                        <br/>
                        <br/>
                        <div className="w-full">
                            <div className="800px:flex items-center">
                                <Ratings rating={data?.ratings} isDemo={true}/>
                                <div className="mb-2 800px:mb-[unset]"/>
                                <h5 className="text-[25px] font-Poppins text-black dark:text-white">
                                    {data.reviews?.length + " Reviews"}
                                </h5>
                            </div>
                            <br/>
                            <br/>
                            {(data?.reviews && [...data.reviews].reverse()).map(
                                (item: any, index: number) => (
                                    <div key={index} className="w-full pb-4">
                                        <div className="flex">
                                            <div className="w-[50px] h-[50px]">
                                                <Image
                                                    priority
                                                    src={
                                                        item?.user.avatar
                                                            ? item?.user.avatar.url
                                                            : avatarDefault
                                                    }
                                                    alt=""
                                                    width={50}
                                                    height={50}
                                                    className="w-[50px] h-[50px] rounded-full object-cover"
                                                />
                                            </div>
                                            <div className="hidden 800px:block pl-2">
                                                <div className="flex items-center">
                                                    <h5 className="text-[18px] pr-2 text-black dark:text-white">
                                                        {item.user.name}
                                                    </h5>
                                                    <Ratings rating={data?.ratings} isDemo={true}/>
                                                </div>
                                                <p className="text-black dark:text-white">
                                                    {item.comment}
                                                </p>
                                                <small className="text-[#000000d1] dark:text-[#ffffff83]">
                                                    {format(item.createdAt)}
                                                </small>
                                            </div>
                                            <div className="pl-2 flex 800px:hidden items-center">
                                                <h5 className="text-[18px] pr-2 text-black dark:text-white">
                                                    {item.user.name}
                                                </h5>
                                                <Ratings rating={data?.ratings} isDemo={true} />
                                            </div>
                                        </div>
                                        {item.commentReplies.map((item: any, index: number) => (
                                            <div className="w-full flex 800px:ml-16 my-5" key={index}>
                                                <div className="w-[50px] h-[50px]">
                                                    <Image
                                                        priority
                                                        src={
                                                            item?.user.avatar
                                                                ? item?.user.avatar.url
                                                                : avatarDefault
                                                        }
                                                        alt=""
                                                        width={50}
                                                        height={50}
                                                        className="w-[50px] h-[50px] rounded-full object-cover"
                                                    />
                                                </div>
                                                <div className="pl-2">
                                                    <div className="flex items-center">
                                                        <h5 className="text-[20px]">{item.user.name}</h5>
                                                        <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]"/>
                                                    </div>
                                                    <p>{item.comment}</p>
                                                    <small className="text-[#ffffff83]">
                                                        {format(item.updatedAt)}
                                                    </small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                    <div className="w-full 800px:w-[35%] relative">
                        <div className="sticky top-[100px] left-0 z-50 w-full">
                            <CoursePlayer videoUrl={data?.demoUrl} title={data?.title}/>
                            <div className="flex items-center">
                                <h1 className="pt-5 text-[25px] text-black dark:text-white">
                                    {data?.price <= 0 ? "Free" : data?.price + "$"}
                                </h1>
                                <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-white">
                                    {data.estimatedPrice > 0 ? data.estimatedPrice + "$" : ""}
                                </h5>
                                <h4 className="pl-5 pt-4 text-[22px] text-black dark:text-white">
                                    {Number(discountPercentengePrice) > 0 ? discountPercentengePrice + "% Off" : ""}
                                </h4>
                            </div>
                            <div className="flex items-center mt-[10px]">
                                {isPurchased || dataUser.role === "admin" ? (
                                    <Link
                                        href={`/course-access/${data._id}`}
                                        className={`${styles.button} !w-[180px] my-2 font-Poppins cursor-pointer !bg-[crimson]`}
                                    >
                                        Enter to Course
                                    </Link>
                                ) : (
                                    <div
                                        className={`${styles.button} !w-[180px] my-2 font-Poppins cursor-pointer !bg-[crimson]`}
                                        onClick={handleOrder}
                                    >
                                        {data?.price <= 0 ? "Enter to Course" : "Buy Now " + data.price + "$"}
                                    </div>
                                )}
                            </div>
                            <br/>
                            <p className="pb-1 text-black dark:text-white">
                                <li>Source code included</li>
                            </p>
                            <p className="pb-1 text-black dark:text-white">
                                <li>Full lifetime access</li>
                            </p>
                            <p className="pb-1 text-black dark:text-white">
                                <li>Certificate of completion</li>
                            </p>
                            <p className="pb-3 800px:pb-1 text-black dark:text-white">
                                <li>Premium Support</li>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <>
                {open && stripePromise && clientSecret && (
                    <div
                        className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
                        <div className="w-[500px] min-h-[500px] bg-white rounded-xl shadow p-3">
                            <div className="w-full flex justify-end">
                                <IoCloseOutline
                                    size={40}
                                    className="text-black cursor-pointer"
                                    onClick={() => setOpen(false)}
                                />
                            </div>
                            <div className="w-full">
                                <Elements stripe={stripePromise} options={{ clientSecret, locale: "en" }}>
                                    <CheckOutForm setOpen={setOpen} data={data} user={user}/>
                                </Elements>
                            </div>
                        </div>
                    </div>
                )}
            </>
        </div>
    );
};

export default CourseDetails;
