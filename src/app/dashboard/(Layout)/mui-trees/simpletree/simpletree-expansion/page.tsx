"use client";

import PageContainer from "@/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import React from "react";

import Grid from '@mui/material/Grid';
import ControlledExpansionTree from "@/components/muitrees/simpletree/ControlledExpansionTree";
import ApiMethodSetItemExpansion from "@/components/muitrees/simpletree/ApiMethodSetItemExpansion";

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

                <ControlledExpansionTree />


                <ApiMethodSetItemExpansion />

            </Grid>
        </PageContainer>
    );
};

export default SimpleTreeView;
