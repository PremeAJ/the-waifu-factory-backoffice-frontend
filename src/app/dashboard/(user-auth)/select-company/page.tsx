import PageContainer from "@/components/container/PageContainer";
import { Box, Container } from "@mui/material";
import { UserDataProvider } from "@/context/UserDataContext/index";
import MyCompanyCard from "@/components/dashboard/user-auth/select-company/MyCompanyCard";
const SelectCompanyPage = () => {
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

export default SelectCompanyPage;
