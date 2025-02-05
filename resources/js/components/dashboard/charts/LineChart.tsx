import React, { useRef, useEffect, useState } from "react";
import { useThemeProvider } from "../../../utils/themeContext";
import { chartColors } from "./ChartConfig";
import useResizeObserver from "../../../hooks/useResizeObserver";
import {
    Chart,
    LineController,
    LineElement,
    Filler,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip,
} from "chart.js";
import "chartjs-adapter-moment";
import moment from "moment";

// Import utilities
import { formatValue } from "../../../utils/utils";

Chart.register(
    LineController,
    LineElement,
    Filler,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip
);

interface LineChartProps {
    data: any;
}

function LineChart({ data }: LineChartProps) {
    const [chart, setChart] = useState<Chart | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { currentTheme } = useThemeProvider();
    const darkMode = currentTheme === "dark";
    const { tooltipBodyColor, tooltipBgColor, tooltipBorderColor } =
        chartColors;
    const [containerRef, dimensions] = useResizeObserver();

    useEffect(() => {
        const ctx = canvasRef.current;
        if (!ctx) return;

        const formattedData = {
            labels: data.labels.map((label: string) =>
                moment(label, "MM-YYYY").toDate()
            ),
            datasets: data.datasets.map((dataset: any) => ({
                ...dataset,
                data: dataset.data.map((value: number, index: number) => ({
                    x: moment(data.labels[index], "MM-YYYY").toDate(),
                    y: value,
                })),
            })),
        };

        const newChart = new Chart(ctx, {
            type: "line",
            data: formattedData,
            options: {
                responsive: true,
                layout: {
                    padding: 20,
                },
                scales: {
                    y: {
                        display: true,
                        beginAtZero: true,
                        grid: {
                            display: false,
                        },
                        ticks: {
                            callback: function (value) {
                                // Display only integer values
                                if (Number.isInteger(value)) {
                                    return value;
                                }
                                return null;
                            },
                        },
                    },
                    x: {
                        type: "time",
                        time: {
                            unit: "month",
                            tooltipFormat: "MM-YYYY",
                            displayFormats: {
                                month: "MM-YYYY",
                            },
                        },
                        grid: {
                            display: true,
                        },
                        ticks: {
                            maxRotation: 0,
                            minRotation: 0,
                            major: {
                                enabled: true,
                            },
                            callback: function (value, index, values) {
                                // Format the tick labels to show month and year
                                return new Date(value).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "short",
                                        year: "numeric",
                                    }
                                );
                            },
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: () => "", // Disable tooltip title
                            label: (context) => {
                                // Remove dollar sign and only display the number
                                const value = context.parsed.y;
                                return value.toString();
                            },
                        },
                        bodyColor: darkMode
                            ? tooltipBodyColor.dark
                            : tooltipBodyColor.light,
                        backgroundColor: darkMode
                            ? tooltipBgColor.dark
                            : tooltipBgColor.light,
                        borderColor: darkMode
                            ? tooltipBorderColor.dark
                            : tooltipBorderColor.light,
                    },
                    legend: {
                        display: false,
                    },
                },
                interaction: {
                    intersect: false,
                    mode: "nearest",
                },
                maintainAspectRatio: false,
                resizeDelay: 200,
            },
        });
        setChart(newChart);
        return () => newChart.destroy();
    }, [darkMode, data, tooltipBgColor, tooltipBodyColor, tooltipBorderColor]);

    useEffect(() => {
        if (chart) {
            chart.resize();
        }
    }, [dimensions, chart]);

    return (
        <div ref={containerRef} className="w-full h-full">
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}

export default LineChart;
