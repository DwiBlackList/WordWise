import React from "react";
import NameComponent from "./NameComponent";
import LeaderboardLink from "./LeadboardLink";

interface Leader {
  name: string;
  rank: number;
}

interface LeaderboardProps {
  title: string;
  leaders: Leader[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ title, leaders }) => {
  return (
    <div className="bg-white px-6 pt-6 shadow rounded-2xl h-full flex flex-col">
      <h2 className="text-gray-500">{title}</h2>
      <ul className="mt-4 space-y-2 flex-grow">
        {leaders.slice(0, 5).map((leader, i) => (
          <NameComponent
            key={i}
            name={leader.name}
            points={52}
            accuracy={95}
            rank={leader.rank}
          />
        ))}
      </ul>
      <div className="mt-auto">
        <LeaderboardLink linkText="View full leaderboard" href="#" />
      </div>
    </div>
  );
};

export default Leaderboard;
