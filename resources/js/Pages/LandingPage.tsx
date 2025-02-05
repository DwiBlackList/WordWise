import { Classes } from "../components/Classes";
import { Client } from "../components/Client";
import Contacts from "../components/Contacts";
import { Features } from "../components/Features";
import Footer from "../components/Footer";
import { Hero } from "../components/Hero";
import { Navigation } from "../components/Navigation";
import Review from "../components/Review";
// import "../css/app.css";
import React from "react";

export const LandingPage = () => {
    return (
        <>
            <Navigation />
            <Hero />
            <Features />
            <Client />
            <Classes />
            <Review />
            <Contacts />
            <Footer />
        </>
    );
};
