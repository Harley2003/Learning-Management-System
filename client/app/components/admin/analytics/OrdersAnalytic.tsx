import { styles } from "@/app/styles/style";
import { useGetOrdersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import React from "react";
import Loader from "../../Loader/Loader";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

type Props = {
    isDashboard?: boolean;
};

export default function OrdersAnalytic({ isDashboard }: Props) {
    const { data, isLoading } = useGetOrdersAnalyticsQuery({});

    const analyticsData: any = [];

    if (data && data.orders) {
        data.orders.last12Months.forEach((item: any) => {
            analyticsData.push({
                name: item.month,
                Order: item.count
            });
        });
    }

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className={`${isDashboard ? "h-[30vh]" : "h-[60vh]"} shadow-lg rounded-lg p-5`}>
                    <div className={`${isDashboard ? "pl-5 mb-3" : "mt-5 mb-5 px-5"}`}>
                        <h1 className={`${styles.title} ${isDashboard ? "!text-[20px]" : "text-2xl"} text-gray-900 dark:text-white font-semibold text-left`}>
                            Orders Analytics
                        </h1>
                        {!isDashboard && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Last 12 months analytics data
                            </p>
                        )}
                    </div>

                    <div className={`w-full ${isDashboard ? "h-full" : "h-[90%]"}`}>
                        <ResponsiveContainer width={isDashboard ? "100%" : "95%"} height={isDashboard ? "100%" : "80%"}>
                            <LineChart data={analyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                                <defs>
                                    <linearGradient id="colorOrder" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="name" tick={{ fill: "#8884d8" }} />
                                <YAxis tick={{ fill: "#8884d8" }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#333",
                                        borderColor: "#82ca9d",
                                        borderRadius: "5px",
                                        color: "#fff"
                                    }}
                                    itemStyle={{ color: "#fff" }}
                                    cursor={{ stroke: "rgba(130, 202, 157, 0.2)", strokeWidth: 2 }}
                                />
                                {!isDashboard && <Legend />}
                                <Line
                                    type="monotone"
                                    dataKey="Order"
                                    stroke="#82ca9d"
                                    strokeWidth={2}
                                    fill="url(#colorOrder)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </>
    );
}