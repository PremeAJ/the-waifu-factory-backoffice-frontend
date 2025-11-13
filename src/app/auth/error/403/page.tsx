import { Box, Container, Typography, Button } from "@mui/material";
import { IconHandStop } from "@tabler/icons-react";
import Link from "next/link";

const Error403 = () => (
  <Box
    display="flex"
    flexDirection="column"
    height="100vh"
    textAlign="center"
    justifyContent="center"
  >
    <Container maxWidth="md">
      <Box mb={4}>
        <IconHandStop size={120} stroke={1.5} style={{ margin: "0 auto" }} color="red"/>
      </Box>
      <Typography align="center" variant="h1" mb={4}>
        403 Forbidden
      </Typography>
      <Typography align="center" variant="h4" mb={4}>
        You do not have permission to access this page.
      </Typography>
      <Button
        color="primary"
        variant="contained"
        component={Link}
        href="/"
        disableElevation
      >
        Go Back to Home
      </Button>
    </Container>
  </Box>
);

export default Error403;