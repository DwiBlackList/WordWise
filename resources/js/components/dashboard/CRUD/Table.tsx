import React, { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import Modal from "./modal";

interface TableProps {
    data: {
        name: string;
        content1: string;
        content2: string;
        content3: string;
    }[];
}

const Table: React.FC<TableProps> = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<{
        name: string;
        content1: string;
        content2: string;
        content3: string;
    } | null>(null);

    const handleRowClick = (row: {
        name: string;
        content1: string;
        content2: string;
        content3: string;
    }) => {
        setSelectedRow(row);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    const handleConfirm = (formData: {
        name: string;
        bio: string;
        details: string[];
    }) => {
        console.log("Form Data:", formData);
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    return (
        <div className="overflow-x-auto w-full">
            <table className="table-auto w-full border-collapse shadow-xl">
                <thead className="bg-white border-b border-gray-200">
                    <tr>
                        <th className="px-2 sm:px-4 py-2 text-left text-gray-600">
                            Name
                        </th>
                        <th className="px-2 sm:px-4 py-2 text-left text-gray-600">
                            Head
                        </th>
                        <th className="px-2 sm:px-4 py-2 text-left text-gray-600">
                            Head
                        </th>
                        <th className="px-2 sm:px-4 py-2 text-left text-gray-600">
                            Head
                        </th>
                        <th className="px-2 sm:px-4 py-2 text-center text-gray-600">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr
                            key={index}
                            className="bg-white cursor-pointer hover:bg-gray-100"
                            onClick={() => handleRowClick(row)}
                        >
                            <td className="px-2 sm:px-4 py-2">{row.name}</td>
                            <td className="px-2 sm:px-4 py-2">
                                {row.content1}
                            </td>
                            <td className="px-2 sm:px-4 py-2">
                                {row.content2}
                            </td>
                            <td className="px-2 sm:px-4 py-2">
                                {row.content3}
                            </td>
                            <td className="px-2 sm:px-4 py-2 text-center">
                                <button
                                    className="text-gray-500 transition duration-200"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        alert(`Delete row ${index + 1}`);
                                    }}
                                >
                                    <FaRegTrashCan />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && selectedRow && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirm}
                />
            )}
        </div>
    );
};

export default Table;
