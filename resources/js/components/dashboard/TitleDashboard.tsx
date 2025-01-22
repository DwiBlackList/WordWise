import React from "react";

interface title {
    name: string;
}

const ReportsComponent: React.FC<title> = ({ name }) => {
    return (
        <div className="flex items-center justify-between border-b border-gray-200 py-2 px-4">
            <h1 className="text-lg font-medium text-gray-800">{name}</h1>
            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <g id="Interface / Download">
                        <path
                            id="Vector"
                            d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
                            stroke="#000000"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                </svg>
                Download
            </button>
        </div>
    );
};

export default ReportsComponent;
