import { useMemo } from "react";
import { SxProps, useTheme } from "@mui/material";
import * as echarts from "echarts/core";
import ReactEchart from "../base/ReactEchart";
import { BarChart } from "echarts/charts";
import {
    TooltipComponent,
    GridComponent,
    AxisPointerComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import React from "react";

echarts.use([
    BarChart,
    TooltipComponent,
    GridComponent,
    AxisPointerComponent,
    CanvasRenderer,
]);

interface SpentThisMonthChartProps {
    data: number[];
    sx?: SxProps;
    style?: React.CSSProperties;
}

const SpentThisMonthChart = ({ data, ...rest }: SpentThisMonthChartProps) => {
    const theme = useTheme();

    const option = useMemo(
        () => ({
            tooltip: {
                axisPointer: null,
                formatter: "Spent: ${c}",
                borderWidth: 0,
            },
            grid: {
                top: "5%",
                left: "5%",
                right: "5%",
                bottom: "3%",
                containLabel: true,
            },
            xAxis: [
                {
                    margin: 10,
                    type: "category",
                    data: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                    ],
                    boundaryGap: false,
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        show: true,
                        margin: 15,
                        fontWeight: 500,
                        color: "#A3AED0",
                        fontSize: "#A3AED0",
                    },
                },
            ],
            yAxis: [
                {
                    type: "value",
                    min: 0,
                    max: 400,
                    minInterval: 100,
                    axisLabel: {
                        show: true,
                        margin: 25,
                    },
                    splitLine: {
                        show: false,
                    },
                },
            ],
            series: [
                {
                    name: "Spent",
                    type: "bar",
                    barWidth: "30%",
                    showBackground: true,
                    backgroundStyle: {
                        color: "#E9EDF7",
                        borderRadius: [10, 10, 10, 10],
                    },
                    data,
                    itemStyle: {
                        color: "#1B59F8CC",
                        borderRadius: [10, 10, 10, 10],
                    },
                    emphasis: {
                        itemStyle: {
                            color: "#1B59F8CC",
                        },
                    },
                },
            ],
            responsive: true,
            maintainAspectRatio: false,
        }),
        [theme, data]
    );

    return (
        <div className="w-full">
            <ReactEchart echarts={echarts} option={option} {...rest} />
        </div>
    );
};

export default SpentThisMonthChart;
