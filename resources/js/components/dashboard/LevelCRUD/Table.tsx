import React, { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import Modal from "./modal";

interface TableProps {
    data: {
        class_name: string;
        token: string;
    }[];
}

const Table: React.FC<TableProps> = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<{
        class_name: string;
        token: string;
    } | null>(null);

    const handleRowClick = (row: { class_name: string; token: string }) => {
        setSelectedRow(row);
        setIsModalOpen(true);
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
                            Level Name
                        </th>
                        <th className="px-2 sm:px-4 py-2 text-left text-gray-600">
                            Chapter Name
                        </th>
                        <th className="px-2 sm:px-4 py-2 text-center text-gray-600">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data?.levelData?.map((row, index) => (
                        <tr
                            key={index}
                            className="bg-white cursor-pointer hover:bg-gray-100"
                        >
                            <td className="px-2 sm:px-4 py-2">
                                {row.level_name}
                            </td>
                            <td className="px-2 sm:px-4 py-2">
                                {row.chapter_name}
                            </td>
                            <td className="px-2 sm:px-4 py-2 text-center">
                                <button
                                    className="text-gray-500 transition duration-200"
                                    // onClick={(e) => {
                                    //     e.stopPropagation();
                                    //     alert(`Delete row ${index + 1}`);
                                    // }}
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
