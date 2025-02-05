import React from "react";
interface ImgBtnProps {
    text: string;
}

export default function ImgBtn({ text }: ImgBtnProps) {
    return (
        <a
            className="relative inline-block border-none bg-none p-0 cursor-pointer h-12 sm:h-14"
            href="/login"
        >
            <img
                src="buttonBg.svg"
                alt="button"
                className="block w-full h-12 sm:h-14"
            />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-base sm:text-lg md:text-xl font-bold w-full text-center">
                {text}
            </span>
        </a>
    );
}
