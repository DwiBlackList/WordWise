import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CardProps {
    className: string;
    token: string;
}

const Card: React.FC<CardProps> = ({ className, token }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white p-6 shadow rounded-3xl text-left w-full h-full border border-gray-100">
            <div className="space-y-6">
                <div className="pb-6 border-b border-gray-100">
                    <h2 className="text-gray-500 text-sm mb-2 uppercase tracking-wide">
                        Class Name
                    </h2>
                    <p className="text-2xl font-bold text-gray-800">
                        {className}
                    </p>
                </div>
                <div>
                    <h2 className="text-gray-500 text-sm mb-3 uppercase tracking-wide">
                        Class Code
                    </h2>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <p className="text-lg font-medium text-gray-700 font-mono">
                            {token}
                        </p>
                        <button
                            onClick={copyToClipboard}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                copied
                                    ? "bg-green-500 text-white"
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                        >
                            {copied ? (
                                <>
                                    <Check size={16} />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={16} />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
                <div className="pt-4">
                    <div className="p-4 bg-blue-50 rounded-xl">
                        <p className="text-sm text-blue-600">
                            Keep this token secure. You'll need it to access
                            your class resources.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
