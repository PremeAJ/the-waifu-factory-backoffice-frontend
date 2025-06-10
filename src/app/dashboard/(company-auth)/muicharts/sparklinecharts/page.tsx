'use client'
import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import React from "react";
import Grid from '@mui/material/Grid';
import BasicSparkLine from "@/components/muicharts/sparklinecharts/BasicSparkLine";
import AreaSparkLineChart from "@/components/muicharts/sparklinecharts/AreaSparkLineChart";
import BasicSparkLineCustomizationChart from "@/components/muicharts/sparklinecharts/BasicSparkLineCustomizationChart";


const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "SparkLineCharts ",
    },
];

const SparkLineCharts = () => {
    return (
        <PageContainer title="SparkLineCharts" description="this is SparkLineCharts ">

            <Breadcrumb title="SparkLineCharts" items={BCrumb} />
            <Grid container spacing={3}>
                <BasicSparkLine />
                <AreaSparkLineChart />
                <BasicSparkLineCustomizationChart />
            </Grid>
        </PageContainer>
    );
};

export default SparkLineCharts;
