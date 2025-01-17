import React, { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import Modal from "./modal";
import axios from "axios";

interface TableProps {
    data: {
        id: string;
        class_name: string;
        token: string;
    }[];
}

const Table: React.FC<TableProps> = ({ data }) => {
    axios.defaults.headers.common["X-CSRF-TOKEN"] = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<{
        class_name: string;
        token: string;
    } | null>(null);

    const handleRowClick = async (id: string) => {
        try {
            const response = await axios.get(`classes/${id}`);
            if (response.status === 200) {
                console.log("Class data retrieved successfully");
                window.location.href = `/classes/${id}`;
            } else {
                console.error("Failed to retrieve class data");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await axios.delete(`/classes/${id}`);
            if (response.status === 201) {
                console.log("Class deleted successfully");
                window.location.reload();
            } else {
                console.error("Failed to delete class");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    return (
        <div className="overflow-x-auto w-full">
            <table className="table-auto w-full border-collapse shadow-xl">
                <thead className="bg-white border-b border-gray-200">
                    <tr>
                        <th className="px-2 sm:px-4 py-2 text-left text-gray-600">
                            Class Name
                        </th>
                        <th className="px-2 sm:px-4 py-2 text-left text-gray-600">
                            Token
                        </th>
                        <th className="px-2 sm:px-4 py-2 text-center text-gray-600">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((row, _) => (
                        <tr
                            key={row.id}
                            className="bg-white  hover:bg-gray-100"
                        >
                            <td className="px-2 sm:px-4 py-2 ">
                                <a
                                    onClick={() => handleRowClick(row.id)}
                                    className="cursor-pointer"
                                >
                                    {row.class_name}
                                </a>
                            </td>
                            <td className="px-2 sm:px-4 py-2">{row.token}</td>
                            <td className="px-2 sm:px-4 py-2 text-center">
                                <button
                                    className="text-gray-500 transition duration-200"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm(`Are you sure you want to delete ${row.class_name}?`)) {
                                            handleDelete(row.id);
                                        }
                                    }}
                                >
                                    <FaRegTrashCan />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
