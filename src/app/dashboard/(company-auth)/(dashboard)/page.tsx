"use client";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useContext, useEffect, useState } from "react";

import PageContainer from "@/components/container/PageContainer";
// components
import YearlyBreakup from "@/components/dashboard/user-auth/modern/YearlyBreakup";
import MonthlyEarnings from "@/components/dashboard/user-auth/modern/MonthlyEarnings";
import TopCards from "@/components/dashboard/user-auth/modern/TopCards";
import RevenueUpdates from "@/components/dashboard/user-auth/modern/RevenueUpdates";
import EmployeeSalary from "@/components/dashboard/user-auth/modern/EmployeeSalary";
import Customers from "@/components/dashboard/user-auth/modern/Customers";
import Projects from "@/components/dashboard/user-auth/modern/Projects";
import Social from "@/components/dashboard/user-auth/modern/Social";
import SellingProducts from "@/components/dashboard/user-auth/modern/SellingProducts";
import WeeklyStats from "@/components/dashboard/user-auth/modern/WeeklyStats";
import TopPerformers from "@/components/dashboard/user-auth/modern/TopPerformers";
import { CustomizerContext } from "@/context/setting/customizerContext";

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const { loading } = useContext(CustomizerContext);
  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box mt={3}>
        <Grid container spacing={3}>
          {/* column */}
          <Grid
            size={{
              xs: 12,
              lg: 12,
            }}
          >
            <TopCards isLoading={isLoading}/>
          </Grid>
          {/* column */}
          <Grid
            size={{
              xs: 12,
              lg: 8,
            }}
          >
            <RevenueUpdates isLoading={isLoading} />
          </Grid>
          {/* column */}
          <Grid
            size={{
              xs: 12,
              lg: 4,
            }}
          >
            <Grid container spacing={3}>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 12,
                }}
              >
                <YearlyBreakup isLoading={isLoading} />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 12,
                }}
              >
                <MonthlyEarnings isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
          {/* column */}
          <Grid
            size={{
              xs: 12,
              lg: 4,
            }}
          >
            <EmployeeSalary isLoading={isLoading} />
          </Grid>
          {/* column */}
          <Grid
            size={{
              xs: 12,
              lg: 4,
            }}
          >
            <Grid container spacing={3}>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Customers isLoading={isLoading} />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Projects isLoading={isLoading} />
              </Grid>
              <Grid size={12}>
                <Social isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
          {/* column */}
          <Grid
            size={{
              xs: 12,
              lg: 4,
            }}
          >
            <SellingProducts isLoading={isLoading} />
          </Grid>
          {/* column */}
          <Grid
            size={{
              xs: 12,
              lg: 4,
            }}
          >
            <WeeklyStats isLoading={isLoading} />
          </Grid>
          {/* column */}
          <Grid
            size={{
              xs: 12,
              lg: 8,
            }}
          >
            <TopPerformers />
          </Grid>
        </Grid>
        {/* <Welcome /> */}
      </Box>
    </PageContainer>
  );
}
