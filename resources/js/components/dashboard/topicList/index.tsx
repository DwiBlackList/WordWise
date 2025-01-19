import React from "react";
import ProgressBarWeakest from "./ProgressBarWeakest";
import ProgressBarStrongest from "./ProgressBarStrongest";

interface Topic {
    percentage: number;
    topic: string;
}

interface TopicsListProps {
    title: string;
    topics: Topic[];
}

const TopicsList: React.FC<TopicsListProps> = ({ title, topics }) => {
    return (
        <div className="bg-white p-4 shadow rounded-2xl h-full">
            <h2 className="text-gray-500">{title}</h2>
            <ul className="mt-4 space-y-2">
                {topics.map((topic, i) =>
                    title === "Strongest Topics" ? (
                        <ProgressBarStrongest
                            key={i}
                            label={`Topic #${topic.topic}`}
                            percentage={topic.percentage}
                        />
                    ) : (
                        <ProgressBarWeakest
                            key={i}
                            label={`Topic #${topic.topic}`}
                            percentage={topic.percentage}
                        />
                    )
                )}
            </ul>
        </div>
    );
};

export default TopicsList;
