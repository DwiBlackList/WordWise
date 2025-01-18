import React, { useState, useEffect } from "react";
import { FaRegTrashCan, FaPencil } from "react-icons/fa6";

interface TableProps {
    data: any;
    handleEdit: (row: any) => void;
    handleDelete: (id: number) => void;
}

const Table: React.FC<TableProps> = ({ data, handleEdit, handleDelete }) => {
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
                                            handleEdit(row);
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
