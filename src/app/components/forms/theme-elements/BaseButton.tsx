import Button, { ButtonProps } from "@mui/material/Button";
import Link from "next/link";

interface BaseButtonProps extends ButtonProps {
  label: string;
}
const BaseButton = ({ label, ...rest }: BaseButtonProps) => {
  return (
    <Button
      color="primary"
      variant="contained"
      size="large"
      fullWidth
      {...(rest.href ? { component: Link } : {})}
      {...rest}
    >
      {label}
    </Button>
  );
};
export default BaseButton;
