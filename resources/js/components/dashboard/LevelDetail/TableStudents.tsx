import React, { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import Modal from "./modal";
import axios from "axios";

interface TableProps {
    data: any;
}

const TableStudents: React.FC<TableProps> = ({ data }) => {
    console.log(data);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<{
        class_name: string;
        token: string;
    } | null>(null);

    const handleRowClick = (row: { class_name: string; token: string }) => {
        setSelectedRow(row);
        setIsModalOpen(true);
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

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="overflow-x-auto w-full">
            <table className="table-auto w-full border-collapse shadow-xl">
                <thead className="bg-white border-b border-gray-200">
                    <tr>
                        <th className="px-2 sm:px-4 py-2 text-left text-gray-600 w-1/4">
                            Student Name
                        </th>
                        <th className="px-2 sm:px-4 py-2 text-left text-gray-600 w-1/4">
                            Score
                        </th>
                        <th className="px-2 sm:px-4 py-2 text-left text-gray-600 w-1/4">
                            Created At
                        </th>
                        <th className="px-2 sm:px-4 py-2 text-left text-gray-600 w-1/4">
                            Updated At
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((row, index) => (
                        <tr key={index} className="bg-white hover:bg-gray-100">
                            <td className="px-2 sm:px-4 py-2">{row.name}</td>
                            <td className="px-2 sm:px-4 py-2">
                                {row.results[0]?.score}
                            </td>
                            <td className="px-2 sm:px-4 py-2">
                                {formatDate(row.results[0]?.created_at)}
                            </td>
                            <td className="px-2 sm:px-4 py-2">
                                {formatDate(row.results[0]?.updated_at)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableStudents;
