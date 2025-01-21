import React, { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import Modal from "./modal";
import axios from "axios";

interface TableProps {
    data: any;
}

const Table: React.FC<TableProps> = ({ data }) => {
    const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = csrfTokenElement
        ? csrfTokenElement.getAttribute("content")
        : "";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<{
        class_name: string;
        token: string;
    } | null>(null);

    const handleRowClick = async (id: string) => {
        console.log(id);
        try {
            const response = await axios.get(`/levels/${id}`);
            if (response.status !== 200) {
                console.error("Failed to fetch level data");
            }

            console.log(response);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await axios.delete(`/levels/${id}`);
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
                        <th className="px-2 sm:px-4 py-2 text-left text-gray-600 w-1/3">
                            Level Name
                        </th>
                        <th className="px-2 sm:px-4 py-2 text-left text-gray-600 w-1/3">
                            Chapter Name
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        key={data.level.id}
                        className="bg-white hover:bg-gray-100"
                        onClick={() => handleRowClick(data.level.id)}
                    >
                        <td className="px-2 sm:px-4 py-2">
                            {data.level.level_name}
                        </td>
                        <td className="px-2 sm:px-4 py-2">
                            {data.level.chapter_name}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Table;
