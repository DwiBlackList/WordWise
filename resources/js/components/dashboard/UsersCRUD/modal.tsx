import React, { useState, useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (formData: {
        name: string;
        email: string;
        school: string;
        password: string;
        role: string;
    }) => void;
    initialData?: {
        name: string;
        email: string;
        school: string;
        password: string;
        role: string;
    };
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    initialData,
}) => {
    const [data, setData] = useState({
        name: "",
        email: "",
        school: "",
        password: "",
        role: "",
    });

    useEffect(() => {
        if (initialData) {
            setData(initialData);
        }
    }, [initialData]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateInput = () => {
        if (
            !data.name ||
            !data.email ||
            !data.school ||
            !data.password ||
            !data.role
        ) {
            alert("Please fill in all fields");
            return false;
        }

        return true;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                <h2 className="text-xl mb-4 mx-4">Add New User</h2>
                <div className="flex items-center mb-4">
                    <div className="ml-4 w-full">
                        {/* Name Input */}
                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={handleInputChange}
                            className="text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4"
                            placeholder="User Name"
                            required
                        />
                        {/* Email Input */}
                        <input
                            type="text"
                            name="email"
                            value={data.email}
                            onChange={handleInputChange}
                            className="text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4"
                            placeholder="Email"
                            required
                        />
                        {/* School Input */}
                        <input
                            type="text"
                            name="school"
                            value={data.school}
                            onChange={handleInputChange}
                            className="text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4"
                            placeholder="School Name"
                            required
                        />
                        {/* Password Input */}
                        <input
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={handleInputChange}
                            className="text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4"
                            placeholder="Password"
                            required
                        />
                        {/* Role Dropdown */}
                        <select
                            name="role"
                            value={data.role}
                            onChange={handleInputChange}
                            className="text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4"
                            required
                        >
                            <option value="" disabled>
                                Select Role
                            </option>
                            <option value="admin">Admin</option>
                            <option value="teacher">Teacher</option>
                            <option value="student">Student</option>
                        </select>
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
                        onClick={() =>
                            validateInput() ? onConfirm(data) : null
                        }
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
