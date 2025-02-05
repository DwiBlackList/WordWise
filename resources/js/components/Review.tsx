import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../components/ui/carousel";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
const testimonials = [
    {
        id: 1,
        name: "Mr. Ama",
        job: "Founder of Darul Hikam High School",
        image: "/darul hikam.png",
        rating: 5,
        text: "I am very interested in digitizing how we learn English, and what is being offered is very relevant to what we need.",
    },
    {
        id: 2,
        name: "Mrs. Ria",
        job: "Head of Yayasan Pendidikan Telkom",
        image: "/logoYpt.png",
        rating: 5,
        text: "We are very interested in using Wordwise in our schools, especially in bilingual classes. The app is very interactive with a Content Managing System feature that makes it easy for teachers.",
    },
    {
        id: 3,
        name: "Mrs. Ryni",
        job: "CEO of Sekolah Hamidah Sampurna",
        image: "/Sekolah Hamidah Sampurna no text.png",
        rating: 5,
        text: "Wordwise application is suitable for our school learning method which has been digitized by using tabs so that it will make the application easier to use, besides that we are also interested in the Content Managing System feature to implement the Cambridge Module-National curriculum that we use.",
    },
];

const Review = () => {
    return (
        <div className="bg-indigo-800 py-8 sm:py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 space-y-2"
                >
                    <p className="text-indigo-200 text-xs sm:text-sm tracking-wider">
                        TESTIMONIAL
                    </p>
                    <h2 className="text-white text-2xl sm:text-3xl font-medium">
                        WHAT ARE THEY SAYING
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Carousel
                        opts={{
                            align: "center",
                            loop: true,
                        }}
                        className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto"
                    >
                        <CarouselContent>
                            {testimonials.map((testimonial) => (
                                <CarouselItem key={testimonial.id}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card className="bg-white p-4 sm:p-6 mx-2 sm:mx-4">
                                            <div className="flex flex-col items-center gap-3 sm:gap-4">
                                                <div className="flex gap-8 items-center">
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{
                                                            duration: 0.3,
                                                        }}
                                                    >
                                                        <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-red-700">
                                                            <AvatarImage
                                                                src={
                                                                    testimonial.image
                                                                }
                                                                alt={
                                                                    testimonial.name
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {
                                                                    testimonial
                                                                        .name[0]
                                                                }
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </motion.div>
                                                    <div className="space-y-1 text-left">
                                                        <div>
                                                            <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                                                                {
                                                                    testimonial.name
                                                                }
                                                            </h3>
                                                            <h3 className="font-medium text-gray-500 text-xs">
                                                                {
                                                                    testimonial.job
                                                                }
                                                            </h3>
                                                        </div>
                                                        <div className="flex gap-0.5">
                                                            {Array.from({
                                                                length: testimonial.rating,
                                                            }).map((_, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    initial={{
                                                                        opacity: 0,
                                                                        scale: 0,
                                                                    }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                        scale: 1,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.2,
                                                                        delay:
                                                                            i *
                                                                            0.1,
                                                                    }}
                                                                >
                                                                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-center text-xs sm:text-sm">
                                                    {testimonial.text}
                                                </p>
                                            </div>
                                        </Card>
                                    </motion.div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="border-white hover:bg-white text-indigo-800 hidden sm:flex" />
                        <CarouselNext className="border-white hover:bg-white text-indigo-800 hidden sm:flex" />
                    </Carousel>
                </motion.div>
            </div>
        </div>
    );
};

export default Review;
