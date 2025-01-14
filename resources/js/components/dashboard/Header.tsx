import React, { useRef, useEffect } from "react";
import "flowbite";
import ReportsComponent from "./TitleDashboard";

const Dropdown: React.FC = () => {
  const buttonRefs = useRef<HTMLButtonElement[]>([]);
  const dropdownRefs = useRef<HTMLDivElement[]>([]);

  const updateDropdownWidth = (index: number) => {
    if (buttonRefs.current[index] && dropdownRefs.current[index]) {
      dropdownRefs.current[
        index
      ].style.width = `${buttonRefs.current[index].offsetWidth}px`;
    }
  };

  useEffect(() => {
    const resizeObservers = buttonRefs.current.map((button, index) => {
      const resizeObserver = new ResizeObserver(() =>
        updateDropdownWidth(index)
      );
      if (button) {
        resizeObserver.observe(button);
      }
      return resizeObserver;
    });

    return () => {
      resizeObservers.forEach((resizeObserver, index) => {
        if (buttonRefs.current[index]) {
          resizeObserver.unobserve(buttonRefs.current[index]);
        }
      });
    };
  }, []);

  return (
    <>
      <ReportsComponent name="Reports" />
      <div className="flex flex-col sm:flex-row mx-1 my-4 gap-4">
        {[
          "Class: Class Name",
          "Timeframe: All-Time",
          "Category: Category-Name",
        ].map((label, index) => (
          <React.Fragment key={index}>
            <button
              id={`dropdownDefaultButton${index}`}
              data-dropdown-toggle={`dropdown${index}`}
              className="text-black bg-white focus:ring-4 focus:outline-none w-full font-medium rounded-2xl text-sm px-5 py-2.5 text-center inline-flex items-center justify-between"
              type="button"
              ref={(el) => (buttonRefs.current[index] = el!)}
            >
              {label}
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
              id={`dropdown${index}`}
              ref={(el) => (dropdownRefs.current[index] = el!)}
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-auto dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby={`dropdownDefaultButton${index}`}
              >
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Dashboard
                  </a>
                </li>
              </ul>
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default Dropdown;
