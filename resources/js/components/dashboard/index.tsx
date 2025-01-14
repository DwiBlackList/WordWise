import Header from "../dashboard/Header";
import Card from "../dashboard/Card";
import TopicsList from "../dashboard/topicList";
import Leaderboard from "../dashboard/Leadboard";
import DashboardCard from "../dashboard/DashboardCard";
import SpentThisYearChart from "./yearStatisticCard.tsx";
import { Box } from "@mui/material";
import React, { act, useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";

const App = ({ data }) => {
    return (
        <div className="flex flex-col w-full h-screen overflow-y-auto bg-gray-100 p-4">
            <Header />
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} alignItems="stretch">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }} height="200px">
                                <Card label="Card Label" value="n/a" />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }} height="200px">
                                <Card label="Card Label" value="n/a" />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <DashboardCard data={data.currentKnowledge} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <DashboardCard data={data.currentKnowledge} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <DashboardCard data={data.currentKnowledge} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <SpentThisYearChart dataActivity={data.activity} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TopicsList
                            title="Weakest Topics"
                            topics={data.weakestTopics}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TopicsList
                            title="Strongest Topics"
                            topics={data.strongestTopics}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Leaderboard
                            title="Groups Leaderboard"
                            leaders={data.leaders}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Leaderboard
                            title="Groups Leaderboard"
                            leaders={data.leaders}
                        />
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default App;
