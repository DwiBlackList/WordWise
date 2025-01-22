import { Eye } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');

    const csrfToken = csrfTokenElement
        ? csrfTokenElement.getAttribute("content")
        : "";

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("/login", {
                email,
                password,
                _token: csrfToken,
            });
            // Handle successful login
            window.location.href = "/home";
        } catch (error) {
            // Handle login error
        }
    };

    return (
        <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <Input
                    type="text"
                    placeholder="Email"
                    className="h-10 sm:h-12 rounded-full border-slate-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="space-y-2 relative">
                <Input
                    type="password"
                    placeholder="Password"
                    className="h-10 sm:h-12 rounded-full border-slate-200 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="text-right">
                <a
                    href="/forgot-password"
                    className="text-xs sm:text-sm text-slate-600 hover:text-slate-800"
                >
                    Forgot password?
                </a>
            </div>

            <Button
                type="submit"
                className="w-full h-10 sm:h-12 rounded-full bg-orange-400 hover:bg-orange-500 text-white font-semibold text-sm sm:text-base"
            >
                Login
            </Button>
        </form>
    );
};

export default LoginForm;
