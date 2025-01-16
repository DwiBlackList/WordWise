import ClassCard from "./ClassCard";
import { motion } from "framer-motion";
import React from "react";
const categories = [
    {
        number: "01",
        category: "Simulate Communication With Native Speaker",
        description:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
        color: "text-green-500",
    },
    {
        number: "02",
        category: "Interactive Gamification",
        description:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
        color: "text-pink-500",
    },
    {
        number: "03",
        category: "On The Go Learning",
        description:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
        color: "text-red-400",
    },
    {
        number: "04",
        category: "Content Managing System",
        description:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
        color: "text-purple-500",
    },
    {
        number: "05",
        category: "Grammar and Pronunciation Checker",
        description:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
        color: "text-amber-500",
    },
    {
        number: "06",
        category: "Progress Monitoring",
        description:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
        color: "text-blue-500",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1,
        },
    },
};

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
                    className="absolute bottom-10 right-0 md:w-1/2 h-auto object-cover z-10"
                />
                <img
                    src="/batu-batu 2.svg"
                    alt="batu"
                    className="absolute w-20 top-14 right-96 z-20"
                />
                <img
                    src="/batu-batu 2.svg"
                    alt="batu"
                    className="absolute w-20 bottom-14 left-16 z-20"
                />
            </div>

            <div className="relative py-16 p-8 space-y-6">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl text-center"
                >
                    Our Feature
                </motion.h1>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                >
                    {categories.map((category) => (
                        <motion.div
                            key={category.number}
                            variants={itemVariants}
                        >
                            <ClassCard
                                number={category.number}
                                category={category.category}
                                description={category.description}
                                color={category.color}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
