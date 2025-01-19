import React, { useState, useEffect } from "react";
import ReportsComponent from "../TitleDashboard";
import ProgressCard from "./CardCircularProgressBar";
import TableComponent from "./Table";
import { Box } from "@mui/material";
import Modal from "./modal";
import Grid from "@mui/material/Grid2";
import axios from "axios";

interface PageProps {
    data: any;
}

const Page: React.FC<PageProps> = ({ data }) => {
    const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = csrfTokenElement
        ? csrfTokenElement.getAttribute("content")
        : "";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({
        name: "",
        school: "",
        password: "",
        role: "",
    });
    const [isEdit, setIsEdit] = useState(false);
    const handleOpenModal = () => {
        setIsEdit(false);
        setSelectedRow(selectedRow);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleAddData = async (formData: {
        name: string;
        email: string;
        school: string;
        password: string;
        role: string;
    }) => {
        console.log("formData: ", formData);
        try {
            const response = await axios.post("/users", {
                ...formData,
                _token: csrfToken,
            });

            if (response.status === 200) {
                console.log("Users added successfully");
            }
        } catch (error) {
            console.error(error);
            // alert(error.response.data.message);
        }

        setIsModalOpen(false);
    };

    const handleEditData = async (
        row: any,
        formData: {
            name: string;
            school: string;
            password: string;
            role: string;
        }
    ) => {
        try {
            const response = await axios.put(`/users/${row.id}`, {
                ...formData,
                _token: csrfToken,
            });

            if (response.status === 200) {
                window.location.reload();
                console.log("Users edited successfully");
            }
        } catch (error) {
            console.error(error);
            // alert(error.response.data.message);
        }

        setIsModalOpen(false);
    };

    const handleConfirm = (data) => {
        isEdit ? handleEditData(data, data) : handleAddData(data);
    };

    const handleEdit = (row: any) => {
        setSelectedRow(row);
        setIsModalOpen(true);
        setIsEdit(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await axios.delete(`/users/${id}`, {
                data: { _token: csrfToken },
            });

            if (response.status === 200) {
                console.log("User deleted successfully");
                window.location.reload();
            }
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-gray-100 p-4">
            <ReportsComponent name="Users" />
            <Box sx={{ flexGrow: 1 }}>
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    mt={2}
                >
                    <div className="flex justify-center items-center w-full">
                        <button
                            onClick={handleOpenModal}
                            className="bg-white w-full text-blue-500 border rounded-full px-4 py-2 hover:bg-blue-50 transition duration-200 focus:outline-none"
                        >
                            Add Data +
                        </button>
                        <Modal
                            state={isModalOpen}
                            onClose={handleCloseModal}
                            onConfirm={handleConfirm}
                            initialData={selectedRow}
                            isEdit={isEdit}
                        />
                    </div>
                </Grid>
                <Grid container mt={2}>
                    <Grid size={{ xs: 12 }}>
                        <div className="p-4 bg-white rounded-xl">
                            <TableComponent
                                data={data}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default Page;
