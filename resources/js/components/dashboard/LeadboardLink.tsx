import React from "react";

interface Props {
  linkText: string;
  href: string;
}

const LeaderboardLink: React.FC<Props> = ({ linkText, href }) => {
  return (
    <div className="flex items-center justify-center py-4 border-t border-gray-200">
      <a
        href={href}
        className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
      >
        {linkText}
        <span className="text-blue-600 text-lg">›</span>
      </a>
    </div>
  );
};

export default LeaderboardLink;
