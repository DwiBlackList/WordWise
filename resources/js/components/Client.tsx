import React from "react";
export const Client = () => {
    return (
        <div className="relative bg-[#449976]">
            <div className="absolute inset-0 z-0">
                <img
                    src="/shade rumput 1.svg"
                    alt="grass shade 1"
                    className="absolute top-36 md:w-1/2 h-auto object-cover z-10"
                />
                <img
                    src="/shade rumput 2.svg"
                    alt="grass shade 2"
                    className="absolute bottom-20 right-0 md:w-1/2 h-auto object-cover z-20"
                />
            </div>

            <div className="relative flex justify-center py-40">
                <div className="flex text-center flex-col space-y-6 md:space-y-10">
                    <div className="space-y-3 md:space-y-4">
                        <h1 className="text-xl md:text-3xl">Our Client</h1>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
                            <img
                                src="/LogoLAC.webp"
                                alt="client1"
                                className="h-12 md:h-24 w-auto object-contain"
                            />
                            <img
                                src="/logoYpt.png"
                                alt="client2"
                                className="h-auto w-24 md:w-40 object-contain"
                            />
                        </div>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                        <h1 className="text-xl md:text-3xl">Our Partnership</h1>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
                            <img
                                src="/logoYpt.png"
                                alt="client2"
                                className="h-auto w-24 md:w-40 object-contain"
                            />
                            <img
                                src="/LogoLAC.webp"
                                alt="client1"
                                className="h-12 md:h-24 w-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
