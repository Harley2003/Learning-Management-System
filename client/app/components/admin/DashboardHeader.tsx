import React, {FC, useCallback, useEffect, useState} from "react";
import ThemeSwitcher from "../../utils/ThemeSwitcher";
import {IoMdNotificationsOutline} from "react-icons/io";
import socketIO from "socket.io-client";
import {
    useGetAllNotificationsQuery,
    useUpdateNotificationStatusMutation
} from "@/redux/features/notification/notificationApli";
import {format} from "timeago.js";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";

type Props = {
    open?: boolean;
    setOpen?: (open: boolean) => void;
};

const DashboardHeader: FC<Props> = ({open = false, setOpen}) => {
    const {data, refetch} = useGetAllNotificationsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [updateNotificationStatus] = useUpdateNotificationStatusMutation();
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            setNotifications(data.notifications.filter((item: any) => item.status === "unread"));
        }
    }, [data]);

    useEffect(() => {
        const socketIo = socketIO(ENDPOINT, {transports: ["websocket"]});
        socketIo.on("newNotification", refetch);

        // return () => {
        //     socketIo.disconnect();
        // };
    }, [refetch]);

    const handleNotificationStatusChange = useCallback(
        async (id: string) => {
            await updateNotificationStatus(id);
            refetch();
        },
        [updateNotificationStatus, refetch]
    );

    const handleToggleOpen = useCallback(() => {
        if (setOpen) setOpen(!open);
    }, [open, setOpen]);

    return (
        <div className="flex items-center justify-end p-6 fixed top-5 right-0 z-[9999999]">
            {/*<ThemeSwitcher/>*/}
            <div className="relative cursor-pointer m-2" onClick={handleToggleOpen}>
                <IoMdNotificationsOutline className="text-2xl dark:text-white text-black"/>
                {notifications.length > 0 && (
                    <span
                        className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
            {notifications.length}
          </span>
                )}
            </div>
            {open && (
                <div className="w-[350px] h-[40vh] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 z-10 rounded">
                    <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white mb-[1rem] pt-[0.5rem]">
                        Notifications
                    </h5>
                    <div className="h-[80%] overflow-y-auto">
                        {notifications.map((item: any, index: number) => (
                            <div
                                className="dark:bg-[#2d3a4ea1] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f]"
                                key={index}
                            >
                                <div className="w-full flex justify-between p-2">
                                    <p className="text-black dark:text-white">{item.title}</p>
                                    <p
                                        className="text-black dark:text-white cursor-pointer"
                                        onClick={() => handleNotificationStatusChange(item._id)}
                                    >
                                        Mark as read
                                    </p>
                                </div>
                                <p className="text-black dark:text-white px-2">{item.message}</p>
                                <p className="p-2 text-black dark:text-white text-[14px]">
                                    {format(item.createdAt)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHeader;
