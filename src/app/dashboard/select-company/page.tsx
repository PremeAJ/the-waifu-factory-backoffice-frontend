import PageContainer from "@/components/container/PageContainer";
import { Box, Container } from "@mui/material";
import { UserDataProvider } from "@/context/UserDataContext/index";
import MyCompanyCard from "@/components/apps/(dashboard)/MyCompanyCard";
const PricingPage = () => {
  return (
    <UserDataProvider>
      <PageContainer title="Portfolio" description="this is Portfolio">
        <Box my={3}>
          <Container maxWidth="lg">
            <MyCompanyCard />
          </Container>
        </Box>
      </PageContainer>
    </UserDataProvider>
  );
};

export default PricingPage;
