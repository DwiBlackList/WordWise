import React from "react";

interface CardProps {
  label: string;
  value: string | number;
}

const Card: React.FC<CardProps> = ({ label, value }) => {
  return (
    <div className="bg-white p-4 shadow rounded-3xl text-left h-full">
      <h2 className="text-gray-500">{label}</h2>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
};

export default Card;
