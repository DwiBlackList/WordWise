import { Instagram, Linkedin, Phone } from "lucide-react";
import React from "react";

const Footer = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between px-4 md:px-32 py-6 md:py-8 bg-[#eabb81] space-y-6 md:space-y-0 items-center md:items-start text-center md:text-left">
            <div className="space-y-2 flex flex-col items-center md:items-start">
                <h1 className="text-2xl">Connect With Us</h1>
                <div className="flex space-x-4">
                    <a href="https://www.instagram.com/lunarinteractive/">
                        <Instagram className="w-5 h-5 md:w-6 md:h-6" />
                    </a>
                    <a href="">
                        <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
                    </a>
                </div>
                <p className="text-sm md:text-base">Or Email Us At:</p>
                <p className="text-sm md:text-base">
                    contact@lunarinteractive.net
                </p>
            </div>

            <div className="space-y-2 flex flex-col items-center md:items-start md:w-1/3">
                <h1 className="text-2xl">Office</h1>
                <p className="text-sm md:text-base">Bandung Techno Park C103</p>
                <p className="text-sm md:text-base">
                    Jl. Telekomunikasi No.1, Sukapura, Kec. Dayeuhkolot,
                    Kabupaten Bandung, Jawa Barat 40257
                </p>
                <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 md:w-6 md:h-6" />
                    <p className="text-sm md:text-base">+62 821-3066-0289</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
