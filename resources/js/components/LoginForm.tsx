import { Eye } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import React from "react";
const LoginForm = () => {
    return (
        <form className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
                <Input
                    type="text"
                    placeholder="Username"
                    className="h-10 sm:h-12 rounded-full border-slate-200"
                />
            </div>

            <div className="space-y-2 relative">
                <Input
                    type="password"
                    placeholder="Password"
                    className="h-10 sm:h-12 rounded-full border-slate-200 pr-10"
                />
                <button
                    type="button"
                    className="absolute right-3 top-2.5 sm:top-3 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password visibility"
                >
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
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
