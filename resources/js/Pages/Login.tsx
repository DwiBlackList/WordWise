import Background from "../components/Background";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import React from "react";

const Login = () => {
    return (
        <div className="min-h-screen bg-[#89e8f5] flex items-center justify-center p-4 sm:p-6 md:p-8">
            <Background />

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 sm:p-8 space-y-4 sm:space-y-6 relative">
                <div className="absolute top-4 left-4">
                    <a
                        href="/"
                        className="text-orange-400 hover:text-orange-500 flex items-center space-x-2"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-semibold">Back</span>
                    </a>
                </div>
                <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                    <img
                        src="logo.svg"
                        alt="logo"
                        className="h-8 sm:h-10 md:h-12"
                    />
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-700">
                        Welcome back!
                    </h2>
                </div>

                <LoginForm />

                <div className="text-center text-sm text-slate-600">
                    Not a member?{" "}
                    <Link
                        to="/"
                        className="text-orange-400 hover:text-orange-500 font-semibold"
                    >
                        Register now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
