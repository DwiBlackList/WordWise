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
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleConfirm = async (formData: { class_name: string }) => {
        console.log("formData: ", formData);
        try {
            const response = await axios.post("/classes", {
                ...formData,
                _token: csrfToken,
            });

            console.log("data: ", response.data);

            if (response.status === 201) {
                console.log("Class added successfully");
                window.location.reload();
            } else {
                console.error("Failed to add class");
            }
        } catch (error) {
            console.error("Error:", error);
        }

        setIsModalOpen(false);
    };
    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-gray-100 p-4">
            <ReportsComponent name="Class" />
            <Box sx={{ flexGrow: 1 }}>
                {/* <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <ProgressCard
                            level={data.levelProgress.level}
                            progress={data.levelProgress.progress}
                            current={data.levelProgress.current}
                            total={data.levelProgress.total}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <ProgressCard
                            level={data.levelProgress.level}
                            progress={data.levelProgress.progress}
                            current={data.levelProgress.current}
                            total={data.levelProgress.total}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <ProgressCard
                            level={data.levelProgress.level}
                            progress={data.levelProgress.progress}
                            current={data.levelProgress.current}
                            total={data.levelProgress.total}
                        />
                    </Grid>
                </Grid> */}
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
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            onConfirm={handleConfirm}
                        />
                    </div>
                </Grid>
                <Grid container mt={2}>
                    <Grid size={{ xs: 12 }}>
                        <div className="p-4 bg-white rounded-xl">
                            <TableComponent data={data} />
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default Page;
