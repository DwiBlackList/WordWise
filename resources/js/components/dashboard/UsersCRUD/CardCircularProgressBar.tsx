import React from "react";

interface ProgressCardProps {
  level: string;
  progress: string;
  current: number;
  total: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  level,
  progress,
  current,
  total,
}) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full bg-white shadow-sm rounded-2xl mt-2 p-4 flex flex-col lg:flex-row  lg:items-center sm:flex-col sm:items-center">
      <div className="flex flex-col mb-4 sm:mb-0 sm:mr-4 text-center sm:text-left">
        <h3 className="text-lg font-semibold">{level}</h3>
        <p className="text-sm text-gray-500">{progress}</p>
      </div>
      <div className="relative w-24 h-24 mx-auto md:mx-auto sm:mx-auto lg:mr-4 flex-shrink-0">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: "#7FDD53", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#2FEA9B", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
          <path
            className="text-gray-200"
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold">
          {current}/{total}
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
