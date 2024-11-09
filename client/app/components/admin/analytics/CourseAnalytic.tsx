import React, { FC } from "react";
import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    LabelList,
    Legend
} from "recharts";
import { styles } from "@/app/styles/style";
import Loader from "../../Loader/Loader";
import { useGetCoursesAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";

type Props = {
    isDashboard?: boolean;
};

const CourseAnalytic: FC<Props> = ({ isDashboard }) => {
    const { data, isLoading } = useGetCoursesAnalyticsQuery({});

    const analyticsData: any = [];

    data && data.courses.last12Months.forEach((item: any) => {
        analyticsData.push({ name: item.month, Course: item.count });
    });

    const minValue = 0;

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className={`${isDashboard ? "h-[30vh]" : "h-[60vh]"} shadow-lg rounded-lg p-5`}>
                    <div className={`${isDashboard ? "pl-5 mb-3" : "mt-5 mb-5 px-5"}`}>
                        <h1 className={`${styles.title} ${isDashboard ? "!text-[20px]" : "text-2xl"} font-semibold text-gray-900 dark:text-white text-left`}>
                            Courses Analytics
                        </h1>
                        {!isDashboard && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Last 12 months analytics data
                            </p>
                        )}
                    </div>

                    <div className={`w-full ${isDashboard ? "h-full" : "h-[90%]"}`}>
                        <ResponsiveContainer width={isDashboard ? "100%" : "95%"} height={isDashboard ? "100%" : "80%"}>
                            <BarChart data={analyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="name" tick={{ fill: "#8884d8" }} />
                                <YAxis tick={{ fill: "#8884d8" }} domain={[minValue, "auto"]} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#444",
                                        borderColor: "#3faf82",
                                        borderRadius: "5px",
                                        color: "#fff",
                                        padding: "10px",
                                    }}
                                    itemStyle={{ color: "#fff" }}
                                    cursor={{ fill: "rgba(63, 175, 130, 0.2)" }}
                                />
                                <Legend />
                                <Bar dataKey="Course" fill="#3faf82" radius={[5, 5, 0, 0]}>
                                    <LabelList dataKey="Course" position="top" fill="#333" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </>
    );
};

export default CourseAnalytic;