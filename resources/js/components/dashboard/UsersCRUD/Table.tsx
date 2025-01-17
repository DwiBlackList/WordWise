import React, { useState, useEffect } from "react";
import { FaRegTrashCan, FaPencil } from "react-icons/fa6";
import Modal from "./modal";
import axios from "axios";

interface TableProps {
    data: {
        name: string;
        school: string;
        role: string;
        token: string;
    }[];
}

const Table: React.FC<TableProps> = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<{
        class_name: string;
        token: string;
    } | null>(null);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleDelete = async (id: string) => {
        try {
            const response = await axios.delete(`/users/${id}`);
            if (response.status === 200) {
                console.log("Class deleted successfully");
                window.location.reload();
            } else {
                console.error("Failed to delete class");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleEdit = async (id: string) => {
        try {
            const response = await axios.put(`/users/${id}`);
            if (response.status === 200) {
                console.log("User update successfully");
                window.location.reload();
            } else {
                console.error("Failed to update user");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="overflow-x-auto w-full">
            <table className="table-auto w-full border-collapse shadow-xl">
                <thead className="bg-white border-b border-gray-200">
                    <tr>
                        <th className="px-2 sm:px-4 py-2 text-left text-gray-600 w-1/3">
                            Name
                        </th>
                        <th className="px-2 sm:px-4 py-2 text-left text-gray-600 w-1/3">
                            School
                        </th>
                        <th className="px-2 sm:px-4 py-2 text-left text-gray-600 w-1/4">
                            Role
                        </th>
                        <th className="px-2 sm:px-4 py-2 text-center text-gray-600 w-1/6">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data?.users?.map((row, index) => (
                        <tr
                            key={index}
                            className="bg-white cursor-pointer hover:bg-gray-100"
                        >
                            <td className="px-2 sm:px-4 py-2">{row.name}</td>
                            <td className="px-2 sm:px-4 py-2">{row.school}</td>
                            <td className="px-2 sm:px-4 py-2">{row.role}</td>
                            <td className="px-2 sm:px-4 py-2 text-center">
                                <div className="flex gap-4 justify-center">
                                    <button
                                        className="text-gray-500 transition duration-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            alert(`Edit ${row.name}`);
                                        }}
                                    >
                                        <FaPencil />
                                    </button>
                                    <button
                                        className="text-gray-500 transition duration-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (
                                                window.confirm(
                                                    `Are you sure you want to delete ${row.name}?`
                                                )
                                            ) {
                                                handleDelete(row.id);
                                            }
                                        }}
                                    >
                                        <FaRegTrashCan />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
