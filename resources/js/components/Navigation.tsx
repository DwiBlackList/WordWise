import ImgBtn from "../components/ImgBtn";
import React from "react";
export const Navigation = () => {
    return (
        <nav className="w-full flex justify-between px-4 sm:px-8 md:px-12 lg:px-16 py-2 sm:py-4 items-center bg-[#89e8f5]">
            <img src="logo.svg" alt="logo" className="h-6 sm:h-8" />
            <ImgBtn text="Login" />
        </nav>
    );
};
