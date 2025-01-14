import React, { useRef, useEffect, useState } from "react";
import { useThemeProvider } from "../../../utils/themeContext";
import { chartColors } from "./ChartConfig";
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
    width?: number;
    height?: number;
}

function LineChart01({ data, width = 400, height = 300 }: LineChartProps) {
    const [chart, setChart] = useState<Chart | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { currentTheme } = useThemeProvider();
    const darkMode = currentTheme === "dark";
    const { tooltipBodyColor, tooltipBgColor, tooltipBorderColor } =
        chartColors;

    useEffect(() => {
        const ctx = canvasRef.current;
        if (!ctx) return;
        const newChart = new Chart(ctx, {
            type: "line",
            data: data,
            options: {
                layout: {
                    padding: 20,
                },
                scales: {
                    y: {
                        display: false,
                        beginAtZero: true,
                    },
                    x: {
                        type: "time",
                        time: {
                            parser: "MM-DD-YYYY",
                            unit: "month",
                        },
                        display: false,
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: () => "", // Disable tooltip title
                            label: (context) => formatValue(context.parsed.y),
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

    return <canvas ref={canvasRef} width={width} height={height}></canvas>;
}

export default LineChart01;
