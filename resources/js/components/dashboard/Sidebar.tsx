import { useState } from "react";
import { PanelRightOpen, PanelRightClose } from "lucide-react";
import React from "react";
export const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            <div
                className={`flex flex-col top-0 left-0 ${
                    isExpanded ? "w-56" : "w-16"
                } bg-white h-screen overflow-hidden transition-width duration-300`}
            >
                <div className="flex items-center justify-between h-14 px-4">
                    {isExpanded && (
                        <img src="logo.svg" alt="logo" className="h-8" />
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="focus:outline-none"
                    >
                        {isExpanded ? (
                            <PanelRightOpen className="w-5 h-5" />
                        ) : (
                            <PanelRightClose className="w-5 h-5 ml-2" />
                        )}
                    </button>
                </div>
                <div className="overflow-x-hidden flex-grow">
                    <ul className="flex flex-col py-4 space-y-1">
                        <li className="px-5"></li>
                        <li>
                            <a
                                href="/dashboard"
                                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500"
                            >
                                <span
                                    className={`inline-flex justify-center items-center ${
                                        isExpanded ? "ml-4" : "mx-auto"
                                    }`}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                        ></path>
                                    </svg>
                                </span>
                                <span
                                    className={`ml-2 text-sm tracking-wide truncate ${
                                        !isExpanded && "hidden"
                                    }`}
                                >
                                    Home
                                </span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/table"
                                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500"
                            >
                                <span
                                    className={`inline-flex justify-center items-center ${
                                        isExpanded ? "ml-4" : "mx-auto"
                                    }`}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                        ></path>
                                    </svg>
                                </span>
                                <span
                                    className={`ml-2 text-sm tracking-wide truncate ${
                                        !isExpanded && "hidden"
                                    }`}
                                >
                                    Table
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>

                {/* User Info Section */}
                <div className="flex w-3/4 border-b border-gray-200 self-center">
                    <br />
                </div>
                <div className="flex items-center p-4">
                    <img
                        src="https://www.nicepng.com/png/full/128-1280406_user-icon-png.png"
                        alt="User"
                        className="w-8 h-8 rounded-full"
                    />
                    <div className={`ml-3 ${!isExpanded && "hidden"}`}>
                        <p className="text-sm font-medium text-gray-800">
                            goji nama panjang
                        </p>
                        <p className="text-sm text-gray-500">
                            goji@example.com
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
