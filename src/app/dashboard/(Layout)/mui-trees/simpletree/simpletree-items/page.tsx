"use client";

import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import React from "react";

import Grid from '@mui/material/Grid';
import BasicSimpleTreeView from "@/components/muitrees/simpletree/BasicSimpleTreeView";
import TrackitemclicksTree from "@/components/muitrees/simpletree/TrackitemclicksTree";

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "SimpleTreeView ",
    },
];

const SimpleTreeView = () => {
    return (
        <PageContainer title="SimpleTreeView" description="this is SimpleTreeView ">
            <Breadcrumb title="SimpleTreeView" items={BCrumb} />
            <Grid container spacing={3}>

                <BasicSimpleTreeView />

                <TrackitemclicksTree />

            </Grid>
        </PageContainer>
    );
};

export default SimpleTreeView;
