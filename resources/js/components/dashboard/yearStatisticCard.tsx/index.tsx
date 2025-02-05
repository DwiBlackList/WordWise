import SpentThisMonthChart from "./SpentThisYear";
import React from "react";
const SpentThisMonth = ({ dataActivity }) => {
    return (
        <div className="bg-white px-2 shadow rounded-3xl h-full">
            <div className="pt-5 px-6">Activity</div>

            <div className="mt-4">
                <SpentThisMonthChart
                    data={dataActivity}
                    sx={{ height: "100%" }}
                />
            </div>
        </div>
    );
};

export default SpentThisMonth;
