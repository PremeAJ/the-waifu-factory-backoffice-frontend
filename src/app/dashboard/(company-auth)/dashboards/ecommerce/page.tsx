"use client"
import React from 'react';
import { useEffect, useState } from 'react';

import { Box, Grid } from '@mui/material';
import PageContainer from '@/components/container/PageContainer';

import WeeklyStats from '@/components/dashboard/user-auth/modern/WeeklyStats';
import YearlySales from '@/components/dashboard/user-auth/ecommerce/YearlySales';
import PaymentGateways from '@/components/dashboard/user-auth/ecommerce/PaymentGateways';
import WelcomeCard from '@/components/dashboard/user-auth/ecommerce/WelcomeCard';
import Expence from '@/components/dashboard/user-auth/ecommerce/Expence';
import Growth from '@/components/dashboard/user-auth/ecommerce/Growth';
import RevenueUpdates from '@/components/dashboard/user-auth/ecommerce/RevenueUpdates';
import SalesOverview from '@/components/dashboard/user-auth/ecommerce/SalesOverview';
import SalesTwo from '@/components/dashboard/user-auth/ecommerce/SalesTwo';
import Sales from '@/components/dashboard/user-auth/ecommerce/Sales';
import MonthlyEarnings from '@/components/dashboard/user-auth/ecommerce/MonthlyEarnings';
import ProductPerformances from '@/components/dashboard/user-auth/ecommerce/ProductPerformances';
import RecentTransactions from '@/components/dashboard/user-auth/ecommerce/RecentTransactions';

const Ecommerce = () => {

  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <PageContainer title="eCommerce Dashboard" description="this is eCommerce Dashboard">
      <Box mt={3}>
        <Grid container spacing={3}>
          {/* column */}
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <WelcomeCard />
          </Grid>

          {/* column */}
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <Grid container spacing={3}>
              <Grid
                size={{
                  xs: 12,
                  sm: 6
                }}>
                <Expence isLoading={isLoading} />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6
                }}>
                <Sales isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 4
            }}>

            <RevenueUpdates isLoading={isLoading} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 4
            }}>

            <SalesOverview isLoading={isLoading} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 4
            }}>
            <Grid container spacing={3}>
              <Grid
                size={{
                  xs: 12,
                  sm: 6
                }}>

                <SalesTwo isLoading={isLoading} />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6
                }}>
                <Growth isLoading={isLoading} />
              </Grid>
              <Grid size={12}>
                <MonthlyEarnings isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
          {/* column */}
          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 4
            }}>
            <WeeklyStats isLoading={isLoading} />
          </Grid>
          {/* column */}
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>

            <YearlySales isLoading={isLoading} />
          </Grid>
          {/* column */}
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <PaymentGateways />
          </Grid>
          {/* column */}

          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <RecentTransactions />
          </Grid>
          {/* column */}

          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <ProductPerformances />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Ecommerce;
