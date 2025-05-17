import { Box, Container, Typography, Button } from "@mui/material";
import Image from "next/image";
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
      <Image
        src={"/images/backgrounds/Error/403.png"}
        alt="403"
        width={400}
        height={400}
        style={{ width: "100%", maxWidth: "400px", maxHeight: "400px" }}
      />
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