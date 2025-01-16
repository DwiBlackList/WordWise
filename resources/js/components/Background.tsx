import React from "react";
const Background = () => {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0">
                <img
                    src="/gunungcrop.png"
                    alt="Mountain silhouette"
                    className="w-[500%] sm:w-[200%] translate-y-20"
                />
            </div>
            <div className="absolute top-60 left-10 sm:left-32">
                <img
                    src="/awan 2.svg"
                    alt="Cloud"
                    className="w-[150%] sm:w-[200%] translate-y-10"
                />
            </div>
            <div className="absolute sm:bottom-60 bottom-20 right-10 sm:right-40">
                <img
                    src="/awan 2.svg"
                    alt="Cloud"
                    className="w-[150%] sm:w-[200%] translate-y-10"
                />
            </div>
            <div className="absolute top-5 right-20 sm:right-96">
                <img
                    src="/awan 1.svg"
                    alt="Cloud"
                    className="w-[150%] sm:w-[200%] translate-y-10"
                />
            </div>
        </div>
    );
};

export default Background;
