import { motion } from "framer-motion";
import React from "react";
const Contacts = () => {
    return (
        <div className="flex flex-col md:flex-row px-4 md:px-16 py-16 w-full md:justify-evenly items-center gap-8 md:gap-0">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-8 md:space-y-12 text-center md:text-left"
            >
                <div className="space-y-2">
                    <p className="text-indigo-400 text-xs sm:text-sm tracking-wider">
                        CONTACT
                    </p>
                    <h2 className="text-xl md:text-2xl">
                        CHAT LUNAR INTERACTIVE NOW
                    </h2>
                    <br />
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-red-500 hover:bg-red-600 px-16 text-white py-4 rounded-md"
                        href="https://wa.me/6282130660289"
                        target="_blank"
                    >
                        Chat Now
                    </motion.a>
                </div>
                <div className="space-y-2">
                    <p className="text-indigo-400 text-xs sm:text-sm tracking-wider">
                        JOIN CLASS IN OUR APPS
                    </p>
                    <h2 className="text-xl md:text-2xl">DOWNLOAD NOW!</h2>
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href=""
                        className="cursor-pointer w-auto"
                    >
                        <img
                            src="./GetItOnGooglePlay_Badge_Web_color_English.png"
                            alt="Get It On Google Play"
                            className="h-10 md:h-12 mx-auto md:mx-0"
                        />
                    </motion.a>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full md:w-auto px-8 md:px-0"
            >
                <img
                    src="phone.png"
                    alt="phone"
                    className="w-full max-w-[300px] md:max-w-none mx-auto"
                />
            </motion.div>
        </div>
    );
};

export default Contacts;
