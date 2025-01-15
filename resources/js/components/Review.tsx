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
import React from "react";

const testimonials = [
    {
        id: 1,
        name: "JANE",
        image: "/placeholder.svg?height=40&width=40",
        rating: 5,
        text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
    },
    {
        id: 2,
        name: "JOHN",
        image: "/placeholder.svg?height=40&width=40",
        rating: 5,
        text: "Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
    },
    {
        id: 3,
        name: "SARAH",
        image: "/placeholder.svg?height=40&width=40",
        rating: 5,
        text: "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.",
    },
];

const Review = () => {
    return (
        <div className="bg-indigo-800 py-8 sm:py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <div className="mb-8 space-y-2">
                    <p className="text-indigo-200 text-xs sm:text-sm tracking-wider">
                        TESTIMONIAL
                    </p>
                    <h2 className="text-white text-2xl sm:text-3xl font-medium">
                        WHAT OUR STUDENTS SAY
                    </h2>
                </div>

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
                                <Card className="bg-white p-4 sm:p-6 mx-2 sm:mx-4">
                                    <div className="flex flex-col items-center gap-3 sm:gap-4">
                                        <div className="flex gap-8 items-center">
                                            <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-red-700">
                                                <AvatarImage
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                />
                                                <AvatarFallback>
                                                    {testimonial.name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1 text-left">
                                                <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                                                    {testimonial.name}
                                                </h3>
                                                <div className="flex justify-center gap-0.5">
                                                    {Array.from({
                                                        length: testimonial.rating,
                                                    }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-center text-xs sm:text-sm">
                                            {testimonial.text}
                                        </p>
                                    </div>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="border-white hover:bg-whitetext-indigo-800 hidden sm:flex" />
                    <CarouselNext className="border-white hover:bg-white text-indigo-800 hidden sm:flex" />
                </Carousel>
            </div>
        </div>
    );
};

export default Review;
