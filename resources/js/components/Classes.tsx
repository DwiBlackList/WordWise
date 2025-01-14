import ClassCard from "./ClassCard";
import React from "react";

const categories = [
    {
        number: "01",
        category: "MATH",
        description:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
        color: "text-green-500",
    },
    {
        number: "02",
        category: "SCIENCE",
        description:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
        color: "text-pink-500",
    },
    {
        number: "03",
        category: "LANGUAGE",
        description:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
        color: "text-red-400",
    },
    {
        number: "04",
        category: "ENTREPRENEUR",
        description:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
        color: "text-purple-500",
    },
    {
        number: "05",
        category: "PROGRAMMING",
        description:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
        color: "text-amber-500",
    },
    {
        number: "06",
        category: "WEB DESIGN",
        description:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
        color: "text-blue-500",
    },
];

export const Classes = () => {
    return (
        <div className="relative bg-[#eabb81]">
            <div className="absolute inset-0 z-0">
                <img
                    src="/shade tanah 1.svg"
                    alt="dirt shade 1"
                    className="absolute top-10 md:w-1/2 h-auto object-cover z-10"
                />
                <img
                    src="/shade tanah 2.svg"
                    alt="dirt shade 2"
                    className="absolute bottom-10 right-0 md:w-1/2 h-auto object-cover z-20"
                />
            </div>

            <div className="relative py-16 p-8 space-y-6">
                <h1 className="text-4xl text-center">Our Classes</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {categories.map((category) => (
                        <ClassCard
                            key={category.number}
                            number={category.number}
                            category={category.category}
                            description={category.description}
                            color={category.color}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
