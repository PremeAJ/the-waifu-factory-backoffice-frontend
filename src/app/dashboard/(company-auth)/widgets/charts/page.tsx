
import { Grid } from "@mui/material";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import YearlyBreakup from "@/components/dashboard/user-auth/modern/YearlyBreakup";
import Projects from "@/components/dashboard/user-auth/modern/Projects";
import Customers from "@/components/dashboard/user-auth/modern/Customers";
import SalesTwo from "@/components/dashboard/user-auth/ecommerce/SalesTwo";
import MonthlyEarnings from "@/components/dashboard/user-auth/ecommerce/MonthlyEarnings";
import SalesOverview from "@/components/dashboard/user-auth/ecommerce/SalesOverview";
import RevenueUpdates from "@/components/dashboard/user-auth/ecommerce/RevenueUpdates";
import YearlySales from "@/components/dashboard/user-auth/ecommerce/YearlySales";
import MostVisited from "@/components/widgets/charts/MostVisited";
import PageImpressions from "@/components/widgets/charts/PageImpressions";
import Followers from "@/components/widgets/charts/Followers";
import Views from "@/components/widgets/charts/Views";
import Earned from "@/components/widgets/charts/Earned";
import CurrentValue from "@/components/widgets/charts/CurrentValue";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Charts",
  },
];

const WidgetCharts = () => {

  return (
    (<PageContainer title="Charts" description="this is Charts">
      {/* breadcrumb */}
      <Breadcrumb title="Charts" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
        <Grid
          size={{
            xs: 12,
            sm: 3
          }}>
          <Followers />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 3
          }}>
          <Views />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 3
          }}>
          <Earned />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 3
          }}>
          <SalesTwo />
        </Grid>
        <Grid size={12}>
          <CurrentValue />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 4
          }}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <YearlyBreakup />
            </Grid>
            <Grid size={12}>
              <MonthlyEarnings />
            </Grid>
            <Grid size={12}>
              <MostVisited />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 4
          }}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <YearlySales />
            </Grid>
            <Grid size={12}>
              <PageImpressions />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <Customers />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6
              }}>
              <Projects />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 4
          }}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <RevenueUpdates />
            </Grid>
            <Grid size={12}>
              <SalesOverview />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>)
  );
};

export default WidgetCharts;
