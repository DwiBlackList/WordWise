import { cn } from "../lib/utils";
import React from "react";

interface CategoryCardProps {
    number: string;
    category: string;
    description: string;
    color: string;
}

const ClassCard = ({
    number,
    category,
    description,
    color,
}: CategoryCardProps) => {
    return (
        <div className="bg-white rounded-3xl p-6 flex flex-col gap-4">
            <div className="space-y-1">
                <p className="text-2xl text-gray-700 font-light">{number}.</p>
                <p className={cn("text-sm uppercase tracking-wider", color)}>
                    {category}
                </p>
            </div>
            <p className="text-gray-600 text-sm flex-1">{description}</p>
        </div>
    );
};

export default ClassCard;
