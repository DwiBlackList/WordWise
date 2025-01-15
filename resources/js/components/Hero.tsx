import ImgBtn from "./ImgBtn";
import React from "react";

export const Hero = () => {
    return (
        <div className="relative bg-[#89e8f5] overflow-hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-10 sm:top-20 left-10 sm:left-10">
                    <img
                        src="/awan 1.svg"
                        alt="Cloud"
                        className="w-[150%] sm:w-[200%] translate-y-10"
                    />
                </div>
                <div className="absolute top-40 sm:top-80 right-10 sm:right-10">
                    <img
                        src="/awan 2.svg"
                        alt="Cloud"
                        className="w-[150%] sm:w-[200%] translate-y-10"
                    />
                </div>
                <div className="absolute top-5 sm:top-4 right-20 sm:right-36">
                    <img
                        src="/awan 2.svg"
                        alt="Cloud"
                        className="w-[150%] sm:w-[200%] translate-y-10"
                    />
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <img
                        src="/awanbackground.svg"
                        alt="Cloud background"
                        className="w-[250%] sm:w-[200%] translate-y-3/4"
                    />
                </div>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center py-6 sm:py-10 md:py-16 space-y-4 sm:space-y-6 md:space-y-8">
                <img
                    src="./videoscreen.svg"
                    alt="video screen"
                    className="h-48 sm:h-64 md:h-80 w-auto transition-all duration-300"
                />
                <div className="w-[95%] sm:w-[90%] max-w-[700px] px-3 sm:px-4 md:px-6 space-y-2 sm:space-y-3">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                        Speak English Easily
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg">
                        Fun and interactive game that makes learning English
                        simple and engaging. It combines personalized lessons
                        with gamified features to enhance language skill
                        effectively.
                    </p>
                    <ImgBtn text="Join" />
                </div>
            </div>
        </div>
    );
};
