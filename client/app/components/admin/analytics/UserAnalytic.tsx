import {styles} from "@/app/styles/style";
import {useGetUsersAnalyticsQuery} from "@/redux/features/analytics/analyticsApi";
import React, {FC} from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import Loader from "../../Loader/Loader";

type Props = {
    isDashboard?: boolean;
};

const UserAnalytic: FC<Props> = ({isDashboard}) => {
    const {data, isLoading} = useGetUsersAnalyticsQuery({});

    const analyticsData: any = [];

    data &&
    data.users.last12Months.forEach((item: any) => {
        analyticsData.push({name: item.month, User: item.count});
    });

    return (
        <>
            {isLoading ? (
                <Loader/>
            ) : (
                <div
                    className={`${
                        !isDashboard
                            ? "mt-[50px]"
                            : "mt-[50px] dark:bg-[#111C43] shadow-lg pb-5 pt-2 rounded-lg"
                    }`}
                >
                    <div className={`${isDashboard ? "ml-8 mb-5" : "p-5"}`}>
                        <h1
                            className={`${styles.title} ${
                                isDashboard ? "!text-[20px]" : "text-2xl"
                            } px-5 text-left font-semibold text-gray-900 dark:text-white`}
                        >
                            Users Analytics
                        </h1>
                        {!isDashboard && (
                            <p className={`${styles.label} px-5 text-gray-600 dark:text-gray-400`}>
                                Analytics data for the last 12 months
                            </p>
                        )}
                    </div>

                    <div
                        className={`w-full ${
                            isDashboard ? "h-[30vh]" : "h-[60vh]"
                        } flex items-center justify-center px-5`}
                    >
                        <ResponsiveContainer
                            width={isDashboard ? "100%" : "95%"}
                            height={!isDashboard ? "80%" : "100%"}
                        >
                            <AreaChart
                                data={analyticsData}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 0,
                                    bottom: 0
                                }}
                            >
                                <defs>
                                    <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4d62d9" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#4d62d9" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" tick={{fill: "#8884d8"}}/>
                                <YAxis tick={{fill: "#8884d8"}}/>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#333",
                                        borderColor: "#4d62d9",
                                        borderRadius: "5px",
                                        color: "#fff"
                                    }}
                                    itemStyle={{color: "#fff"}}
                                    cursor={{fill: "rgba(77, 98, 217, 0.2)"}}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="User"
                                    stroke="#4d62d9"
                                    fillOpacity={1}
                                    fill="url(#colorUser)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserAnalytic;