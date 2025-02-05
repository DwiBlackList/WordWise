import React from "react";

interface ProgressBarProps {
  label: string;
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, percentage }) => {
  return (
    <div className="flex gap-4">
      {/* Placeholder kotak */}
      <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>

      {/* Informasi dan progress */}
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="font-medium text-gray-800">{label}</span>
        </div>

        {/* Progress bar */}
        <div
          className={`w-full bg-gradient-to-r from-[#ffbe1a1e] to-[#ff40801f] rounded-full h-2.5`}
        >
          <div
            className={`bg-gradient-to-r from-[#ffbe1a] to-[#ff4080] h-2.5 rounded-full`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <div className="flex justify-end items-end">
        <span className="text-gray-500">{percentage}% Correct</span>
      </div>
    </div>
  );
};

export default ProgressBar;
