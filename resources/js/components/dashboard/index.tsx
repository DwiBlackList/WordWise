import Header from "../dashboard/Header";
import Card from "../dashboard/Card";
import TopicsList from "../dashboard/topicList";
import Leaderboard from "../dashboard/Leadboard";
import DashboardCard from "../dashboard/DashboardCard";
import { Box } from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid2";

const App = ({ data }) => {
    return (
        <div className="flex flex-col w-full h-screen overflow-y-auto bg-gray-100 p-4">
            <Header data={data.listClass} />
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} alignItems="stretch">
                    <Grid container size={{ xs: 12, md: 6 }}>
                        <Grid
                            size={{ xs: 12, sm: 12 }}
                            height="100%"
                            width="100%"
                        >
                            <Card
                                className={data.firstClass.class_name}
                                token={data.firstClass.token}
                            />
                        </Grid>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <DashboardCard data={data.currentKnowledge} />
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
                            title="Top first 5"
                            leaders={data.topFirst5}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Leaderboard
                            title="Worst last 5"
                            leaders={data.topLast5}
                        />
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default App;
