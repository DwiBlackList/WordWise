import React, { useState, useEffect } from "react";
import ReportsDashboard from "../components/dashboard";
import { Sidebar } from "../components/dashboard/Sidebar";

export const Dashboard = ({ initialData }) => {
    const [data, setData] = useState(initialData);
    // useEffect(() => {
    //     // Client-side fetch untuk data yang belum diambil oleh server
    //     const fetchData = async () => {
    //         if (!data.length) {
    //             const urls = [
    //                 "api/v1/dashboard/weakness",
    //                 "api/v1/dashboard/strength",
    //                 "api/v1/dashboard/leaderboard",
    //                 "api/v1/dashboard/activity",
    //                 "api/v1/dashboard/currentknowledge",
    //             ];

    //             try {
    //                 const [
    //                     weakestTopics,
    //                     strongestTopics,
    //                     leaders,
    //                     activity,
    //                     currentKnowledge,
    //                 ] = await Promise.all(
    //                     urls.map((url) =>
    //                         fetch(url).then((res) =>
    //                             res.ok
    //                                 ? res.json()
    //                                 : Promise.reject(res.statusText)
    //                         )
    //                     )
    //                 );

    //                 setData({
    //                     weakestTopics: weakestTopics.weakestTopics || [],
    //                     strongestTopics: strongestTopics.strongestTopics || [],
    //                     leaders: leaders.leaders || [],
    //                     activity: activity.activity || [],
    //                     currentKnowledge,
    //                 });
    //             } catch (error) {
    //                 console.error("Failed to fetch dashboard data:", error);
    //             }
    //         }
    //     };

    //     fetchData();
    // }, []);

    return (
        <div className="flex w-full h-screen overflow-hidden">
            <Sidebar user={data.dataUserLogin} />
            <div className="relative flex flex-col flex-1 overflow-x-hidden">
                <main className="w-full">
                    <ReportsDashboard data={data} />
                </main>
            </div>
        </div>
    );
};
