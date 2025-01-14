import React from "react";

export const Features = () => {
    return (
        <div className="relative bg-[#c9f9fd]">
            {/* Background Layer */}
            <div className="absolute inset-0 z-10">
                <img
                    src="/gunung.svg"
                    alt="mountain background"
                    className="absolute bottom-0 w-full h-auto object-cover translate-y-5 sm:translate-y-12 md:translate-y-16 lg:translate-y-24"
                />
            </div>

            {/* Features Content */}
            <div className="relative flex w-full justify-center divide-x-2 divide-black py-6 md:py-14 bg-transparent z-10">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl px-4 sm:px-6 md:px-8 lg:px-10 text-center">
                    <h1>Voice Recognition</h1>
                </div>
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl px-4 sm:px-6 md:px-8 lg:px-10 text-center">
                    <h1>Customable Material</h1>
                </div>
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl px-4 sm:px-6 md:px-8 lg:px-10 text-center">
                    <h1>Progress Tracking</h1>
                </div>
            </div>
        </div>
    );
};
