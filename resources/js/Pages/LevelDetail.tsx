import Table from "../components/dashboard/LevelDetail";
import { Sidebar } from "../components/dashboard/Sidebar";
import React, { useEffect, useState } from "react";
const TableCRUD = ({ ssrData }) => {
    const [data, setData] = useState({
        dataUserLogin: ssrData.dataUserLogin,
        level: ssrData.level,
        student: ssrData.users,
    });

    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (!data.lenght) {
    //             const urls = [
    //                 "/api/table/dataTable",
    //             ];
    //             try {
    //                 const [dataTable, levelProgress] = await Promise.all(
    //                     urls.map((url) =>
    //                         fetch(url).then((res) =>
    //                             res.ok
    //                                 ? res.json()
    //                                 : Promise.reject(res.statusText)
    //                         )
    //                     )
    //                 );

    //                 setData({
    //                     dataTable: dataTable || [],
    //                     levelProgress: levelProgress || [],
    //                 });
    //             } catch (error) {
    //                 console.error("Failed to fetch table data:", error);
    //             }
    //         }
    //     };
    //     fetchData();
    // }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar user={data.dataUserLogin} />
            <div className="relative flex flex-col flex-1 overflow-x-hidden">
                <main>
                    <Table data={data} />
                </main>
            </div>
        </div>
    );
};

export default TableCRUD;
