import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
} from "chart.js";

const canvas = React.createRef<HTMLCanvasElement>();

ChartJS.register(
  LogarithmicScale,
  CategoryScale,
  BarController,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: any;
  options?: any;
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const [chart, setChart] = useState<ChartJS | null>(null);
  useEffect(() => {
    const ctx = canvas.current;
    if (!ctx) return;
    if (chart) {
      chart.destroy();
    }
    const newChart = new ChartJS(ctx, {
      type: "bar",
      data: data,
      options: {
        scales: {
          x: {
            border: {
              display: false,
            },
            display: false,
            grid: { display: false },
            ticks: {
              color: "rgba(0,0,0,0.5)",
            },
          },
          y: {
            max: 400,
            border: {
              display: false,
            },
            grid: { display: false },
            suggestedMax: 400,
            beginAtZero: true,
            ticks: {
              stepSize: 100,
              showLabelBackdrop: false,
            },
          },
        },
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: function (context: any) {
                // Tampilkan hanya tooltip untuk batang utama
                if (context.dataset.label !== "Activity") {
                  return `Revenue ${context.label}: ${context.raw}`;
                }
                return "";
              },
            },
          },
        },
      },
    });
    setChart(newChart);
    return () => newChart.destroy();
  }, [data]);

  return <canvas ref={canvas} width={500} height={500}></canvas>;
};

export default BarChart;
