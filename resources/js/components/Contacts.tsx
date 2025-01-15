import { Button } from "./ui/button";
import React from "react";

const Contacts = () => {
    return (
        <div className="flex flex-col md:flex-row px-4 md:px-16 py-16 w-full md:justify-evenly items-center gap-8 md:gap-0">
            <div className="space-y-8 md:space-y-12 text-center md:text-left">
                <div className="space-y-2">
                    <p className="text-indigo-200 text-xs sm:text-sm tracking-wider">
                        CONTACT
                    </p>
                    <h2 className="text-xl md:text-2xl">
                        CHAT OUR CUSTOMER SERVICE
                    </h2>
                    <Button className="bg-red-500 hover:bg-red-600 px-16">
                        Chat Now
                    </Button>
                </div>
                <div className="space-y-2">
                    <p className="text-indigo-200 text-xs sm:text-sm tracking-wider">
                        JOIN CLASS IN OUR APPS
                    </p>
                    <h2 className="text-xl md:text-2xl">DOWNLOAD NOW!</h2>
                    <a href="" className="cursor-pointer w-auto">
                        <img
                            src="./GetItOnGooglePlay_Badge_Web_color_English.png"
                            alt="Get It On Google Play"
                            className="h-10 md:h-12 mx-auto md:mx-0"
                        />
                    </a>
                </div>
            </div>

            <div className="w-full md:w-auto px-8 md:px-0">
                <img
                    src="phone.png"
                    alt="phone"
                    className="w-full max-w-[300px] md:max-w-none mx-auto"
                />
            </div>
        </div>
    );
};

export default Contacts;
