import React, { useState, useEffect } from "react";
import ReportsComponent from "../TitleDashboard";
import ProgressCard from "./CardCircularProgressBar";
import TableComponent from "./Table";
import { Box, Grid } from "@mui/material";
import Modal from "./modal";

interface PageProps {
    data: any;
}

const Page: React.FC<PageProps> = ({ data }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleConfirm = () => {
        alert("Confirmed!");
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col h-screen overflow-y-auto bg-gray-100 p-4">
            <ReportsComponent name="Table" />
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <ProgressCard
                            level={data.levelProgress.level}
                            progress={data.levelProgress.progress}
                            current={data.levelProgress.current}
                            total={data.levelProgress.total}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <ProgressCard
                            level={data.levelProgress.level}
                            progress={data.levelProgress.progress}
                            current={data.levelProgress.current}
                            total={data.levelProgress.total}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <ProgressCard
                            level={data.levelProgress.level}
                            progress={data.levelProgress.progress}
                            current={data.levelProgress.current}
                            total={data.levelProgress.total}
                        />
                    </Grid>
                </Grid>
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
                    <Grid item xs={12}>
                        <div className="p-4 bg-white rounded-xl">
                            <TableComponent data={data.dataTable.data} />
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default Page;
