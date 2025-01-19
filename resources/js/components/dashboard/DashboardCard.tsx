import React from "react";
import LineChart from "./charts/LineChart";
import { chartAreaGradient } from "./charts/ChartConfig";
import { tailwindConfig, hexToRGB } from "../../utils/utils";

function DashboardCard({ data }) {
    console.log(data);
    const chartData = {
        labels: Object.keys(data.activity),
        datasets: [
            {
                data: Object.values(data.activity),
                fill: true,
                backgroundColor: function (context: any) {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    return chartAreaGradient(ctx, chartArea, [
                        {
                            stop: 0,
                            color: `rgba(${hexToRGB(
                                tailwindConfig().theme.colors.violet[500]
                            )}, 0)`,
                        },
                        {
                            stop: 1,
                            color: `rgba(${hexToRGB(
                                tailwindConfig().theme.colors.violet[500]
                            )}, 0.2)`,
                        },
                    ]);
                },
                borderColor: tailwindConfig().theme.colors.violet[500],
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 3,
                pointBackgroundColor: tailwindConfig().theme.colors.violet[500],
                pointHoverBackgroundColor:
                    tailwindConfig().theme.colors.violet[500],
                pointBorderWidth: 0,
                pointHoverBorderWidth: 0,
                clip: 20,
                tension: 0,
            },
        ],
    };

    return (
        <div className="flex flex-col col-span-full sm:col-span-1 bg-white dark:bg-gray-800 shadow-sm rounded-3xl h-full">
            <div className="px-5 pt-5">
                <header className="flex justify-between items-start">
                    <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                        Activity
                    </h2>
                </header>
                <div className="flex items-start">
                    {/* <div className="text-xl font-bold text-gray-800 dark:text-gray-100 mr-2">
                        86%
                    </div> */}
                </div>
            </div>
            <div className="grow h-full pb-4">
                <LineChart data={chartData} />
            </div>
        </div>
    );
}

export default DashboardCard;
