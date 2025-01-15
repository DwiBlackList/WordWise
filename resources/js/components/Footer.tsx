import { Instagram, Linkedin, Phone, Youtube } from "lucide-react";
import React from "react";

const Footer = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between px-4 md:px-32 py-6 md:py-8 bg-[#eabb81] space-y-6 md:space-y-0 items-center md:items-start text-center md:text-left">
            <div className="space-y-2 flex flex-col items-center md:items-start">
                <h1 className="text-2xl">Connect With Us</h1>
                <div className="flex space-x-4">
                    <a href="https://wordwise.lunarinteractive.net/">
                        <Youtube className="w-5 h-5 md:w-6 md:h-6" />
                    </a>
                    <a href="https://wordwise.lunarinteractive.net/">
                        <Instagram className="w-5 h-5 md:w-6 md:h-6" />
                    </a>
                    <a href="https://wordwise.lunarinteractive.net/">
                        <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
                    </a>
                </div>
                <p className="text-sm md:text-base">Or Email Us At:</p>
                <p className="text-sm md:text-base">email@email.com</p>
            </div>

            <div className="space-y-2 flex flex-col items-center md:items-start">
                <h1 className="text-2xl">Office</h1>
                <p className="text-sm md:text-base">1234 Street</p>
                <p className="text-sm md:text-base">1234 Street</p>
                <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 md:w-6 md:h-6" />
                    <p className="text-sm md:text-base">+62 888 8888 8888</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
