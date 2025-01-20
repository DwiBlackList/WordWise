import { motion } from "framer-motion";
import React from "react";
const schoolLogos = [
    "/SMK Telkom Bandung.png",
    "/SD Telkom Makassar.png",
    "/SD Telkom Batam.png",
    "/SD Telkom Padang.png",
    "/Sekolah Hamidah Sampurna.png",
    "/SMA lab UPI.png",
    "/darul hikam.png",
    "/SMAN 8 Bandung.png",
    "/SMAN 2 Bandung.png",
    "/SMAN 15 Bandung.png",
    "/SMAN 5 Bandung.png",
    "/SMK ICB Cinta Niaga.png",
    "/SMK ICB Cinta Wisata.png",
    "/SMAN 4 Bandung.png",
];

const partnerLogos = [
    "/Bandung Techno Park.png",
    "/indigoHub.png",
    "/LogoLAC.webp",
    "/ESStavfit.png",
    "/Bandung_Techno_Park.png",
    "/indigoHub.png",
    "/LogoLAC.webp",
    "/ESStavfit.png",
];

const Logo = ({ src, alt }: { src: string; alt: string }) => (
    <div className="bg-white rounded-full p-4 flex items-center justify-center min-w-[120px] min-h-[120px] md:min-w-[150px] md:min-h-[150px]">
        <img
            src={src}
            alt={alt}
            className="h-12 md:h-24 w-auto object-contain"
        />
    </div>
);

export const Client = () => {
    return (
        <motion.div
            id="client"
            className="relative bg-[#449976]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="absolute inset-0 z-0">
                <motion.img
                    src="/rumput.svg"
                    alt="rumput"
                    className="absolute w-10 top-32 right-36 z-20"
                    whileInView={{ rotate: [0, 10, 0] }}
                    viewport={{ once: false }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />
                <motion.img
                    src="/rumput.svg"
                    alt="rumput"
                    className="absolute w-10 bottom-28 left-52 z-20"
                    whileInView={{ rotate: [0, -10, 0] }}
                    viewport={{ once: false }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                />
                <motion.img
                    src="/rumput.svg"
                    alt="rumput"
                    className="absolute w-10 bottom-72 right-28 z-20"
                    whileInView={{ rotate: [0, 10, 0] }}
                    viewport={{ once: false }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
                />
                <motion.img
                    src="/rumput.svg"
                    alt="rumput"
                    className="absolute w-10 top-44 left-36 z-20"
                    whileInView={{ rotate: [0, -10, 0] }}
                    viewport={{ once: false }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.9 }}
                />
                <img
                    src="/batu-batu.svg"
                    alt="batu"
                    className="absolute w-10 bottom-20 left-80 z-20"
                />
                <img
                    src="/batu-batu.svg"
                    alt="batu"
                    className="absolute w-10 bottom-32 right-40 z-20"
                />
                <img
                    src="/batu-batu.svg"
                    alt="batu"
                    className="absolute w-10 bottom-72 left-32 z-20"
                />
                <img
                    src="/shade rumput 1.svg"
                    alt="grass shade 1"
                    className="absolute top-36 md:w-1/2 h-auto object-cover z-10"
                />
                <img
                    src="/shade rumput 2.svg"
                    alt="grass shade 2"
                    className="absolute bottom-20 right-0 md:w-1/2 h-auto object-cover z-10"
                />
            </div>

            <div className="relative flex justify-center py-40">
                <motion.div
                    className="flex text-center flex-col space-y-6 md:space-y-10 w-full overflow-hidden"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="space-y-3 md:space-y-4"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.h1
                            className="text-3xl"
                            whileHover={{ scale: 1.05 }}
                        >
                            Wordwise in School
                        </motion.h1>
                        <div className="flex w-full overflow-hidden">
                            <div
                                className="flex animate-infinite-scroll gap-4 py-4 shrink-0"
                                style={
                                    {
                                        "--count": schoolLogos.length,
                                    } as React.CSSProperties
                                }
                            >
                                {[...schoolLogos, ...schoolLogos].map(
                                    (logo, index) => (
                                        <Logo
                                            key={index}
                                            src={logo}
                                            alt={`client${index + 1}`}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        className="space-y-3 md:space-y-4"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <motion.h1
                            className="text-3xl"
                            whileHover={{ scale: 1.05 }}
                        >
                            Our Partnership
                        </motion.h1>
                        <div className="flex w-full overflow-hidden">
                            <div
                                className="flex animate-infinite-scroll-partner gap-4 py-4 shrink-0"
                                style={
                                    {
                                        "--count": partnerLogos.length,
                                    } as React.CSSProperties
                                }
                            >
                                {[...partnerLogos, ...partnerLogos].map(
                                    (logo, index) => (
                                        <Logo
                                            key={index}
                                            src={logo}
                                            alt={`partner${index + 1}`}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};
