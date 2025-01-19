import React from "react";
import NameComponent from "./NameComponent";
import LeaderboardLink from "./LeadboardLink";

interface Leader {
    name: string;
    rank: number;
    totalscore: number;
    accuracy: number;
}

interface LeaderboardProps {
    title: string;
    leaders: Leader[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ title, leaders }) => {
    return (
        <div className="bg-white px-6 pt-6 shadow rounded-2xl h-full flex flex-col mb-4">
            <h2 className="text-gray-500">{title}</h2>
            <ul className="mt-4 space-y-2 flex-grow">
                {leaders.map((leader, i) => (
                    <NameComponent
                        key={i}
                        name={leader.name}
                        points={leader.totalscore}
                        accuracy={leader.accuracy}
                        rank={leader.rank}
                    />
                ))}
            </ul>
            <div className="mt-auto"></div>
        </div>
    );
};

export default Leaderboard;
