import React, { useState, useEffect } from "react";

interface ModalProps {
    state: boolean;
    isEdit: boolean;
    onClose: () => void;
    onConfirm: (formData: {
        name: string;
        email?: string;
        school: string;
        password: string;
        role: string;
    }) => void;
    initialData: {
        name: string;
        password: string;
        school: string;
        role: string;
    };
}

const Modal: React.FC<ModalProps> = ({
    onConfirm,
    initialData,
    state,
    onClose,
    isEdit,
}) => {
    const [dataAdd, setDataAdd] = useState({
        name: "",
        email: "",
        school: "",
        password: "",
        role: "",
    });
    const [dataEdit, setDataEdit] = useState(initialData);

    useEffect(() => {
        if (initialData) {
            setDataEdit(initialData);
        }
    }, [initialData]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setDataEdit((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateInput = () => {
        if (
            state == false
                ? !dataAdd.name ||
                  !dataAdd.email ||
                  !dataAdd.school ||
                  !dataAdd.password ||
                  !dataAdd.role
                : !dataEdit.name ||
                  !dataEdit.school ||
                  !dataEdit.password ||
                  !dataEdit.role
        ) {
            alert("Please fill in all fields");
            return false;
        }

        return true;
    };

    console.log("dataAdd: ", dataAdd);
    console.log("dataEdit: ", dataEdit);

    if (!state) return null;

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
                            value={dataEdit.name}
                            onChange={handleInputChange}
                            className="text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4"
                            placeholder="User Name"
                            required
                        />
                        {/* Email Input */}
                        {isEdit ? null : (
                            <input
                                type="email"
                                name="email"
                                onChange={handleInputChange}
                                className="text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4"
                                placeholder="Email"
                                required
                            />
                        )}
                        {/* School Input */}
                        <input
                            type="text"
                            name="school"
                            value={dataEdit.school}
                            onChange={handleInputChange}
                            className="text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4"
                            placeholder="School Name"
                            required
                        />
                        {/* Password Input */}
                        <input
                            type="password"
                            name="password"
                            value={dataEdit.password}
                            onChange={handleInputChange}
                            className="text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4"
                            placeholder="Password"
                            required
                        />
                        {/* Role Dropdown */}
                        <select
                            name="role"
                            value={dataEdit.role}
                            onChange={handleInputChange}
                            className="text-lg font-semibold rounded-lg border-gray-300 w-full focus:outline-none focus:border-blue-500 mb-4"
                            required
                        >
                            <option value="" disabled>
                                Select Role
                            </option>
                            <option value="admins">Admin</option>
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
                            validateInput()
                                ? state == true
                                    ? onConfirm(dataEdit)
                                    : onConfirm(dataAdd)
                                : null
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
