import React, { useState, useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (formData: { class_name: string }) => void;
    initialData?: {
        class_name: string;
    };
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    initialData,
}) => {
    const [class_name, setClass_name] = useState("");

    // useEffect(() => {
    //     if (initialData) {
    //         setClass_name(initialData.class_name);
    //     }
    // }, [initialData]);

    // const handleDetailChange = (index: number, value: string) => {
    //     const updatedDetails = [...details];
    //     updatedDetails[index] = value;
    //     setDetails(updatedDetails);
    // };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                <h2 className="text-xl mb-4 mx-4"> Add New Class </h2>
                {/* Name and Bio Input */}
                <div className="flex items-center mb-4">
                    <div className="ml-4 w-full">
                        <input
                            type="text"
                            value={class_name}
                            onChange={(e) => setClass_name(e.target.value)}
                            className="text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500"
                            placeholder="Enter Class Name"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-6 space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 focus:ring focus:ring-pink-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm({ class_name })}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
