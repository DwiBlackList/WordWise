import React, { useRef, useEffect } from "react";
import "flowbite";
import ReportsComponent from "./TitleDashboard";

interface Props {
    data: [
        {
            id: number;
            class_name: string;
        }
    ];
}

const Dropdown: React.FC<Props> = ({ data }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const updateDropdownWidth = () => {
        if (buttonRef.current && dropdownRef.current) {
            dropdownRef.current.style.width = `${buttonRef.current.offsetWidth}px`;
        }
    };

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => updateDropdownWidth());
        if (buttonRef.current) {
            resizeObserver.observe(buttonRef.current);
        }

        return () => {
            if (buttonRef.current) {
                resizeObserver.unobserve(buttonRef.current);
            }
        };
    }, []);

    return (
        <>
            <ReportsComponent name="Reports" />
            <div className="flex flex-col sm:flex-row mx-1 my-4 gap-4">
                <button
                    id="dropdownDefaultButton0"
                    data-dropdown-toggle="dropdown0"
                    className="text-black bg-white focus:ring-4 focus:outline-none w-full font-medium rounded-2xl text-sm px-5 py-2.5 text-center inline-flex items-center justify-between"
                    type="button"
                    ref={buttonRef}
                >
                    Class: Class Name
                    <svg
                        className="w-2.5 h-2.5 ms-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 4 4 4-4"
                        />
                    </svg>
                </button>

                <div
                    id="dropdown0"
                    ref={dropdownRef}
                    className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-auto dark:bg-gray-700"
                >
                    <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefaultButton0"
                    >
                        {data.map((data) => (
                            <li key={data.id}>
                                <a
                                    href={`/home/${data.id}`}
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    {data.class_name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Dropdown;
