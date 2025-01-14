import React from "react";

interface Props {
  name: string;
  points: number;
  accuracy: number;
  rank: number;
}

const NameComponent: React.FC<Props> = ({ name, points, accuracy, rank }) => {
  return (
    <div className="flex items-center justify-between px-6 py-2 rounded-lg flex-1 w-full">
      {/* Kiri: Nama dan Detail */}
      <div>
        <p className="font-bold text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">
          {points} Points / User - {accuracy}% Correct
        </p>
      </div>
      {/* Kanan: Rank */}
      <div className="flex items-center gap-1">
        <p className="text-lg font-semibold text-gray-700">{rank}</p>
        <span className="w-4 h-4 rounded-full flex justify-center items-center text-green-500">
          ▲
        </span>
      </div>
    </div>
  );
};

export default NameComponent;
