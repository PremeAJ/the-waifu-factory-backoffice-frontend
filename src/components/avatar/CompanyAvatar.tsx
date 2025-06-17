import Avatar from "@mui/material/Avatar";
import { IconBuildingCommunity, IconToolsKitchen2, IconCoffee, IconBaguette, IconBubbleTea2 } from "@tabler/icons-react";

type CompanyAvatarProps = {
  businessTypeId?: number;
  imageUrl?: string;
  size?: number;
};

const width = 24;
const height = 24;

const iconMap: Record<number, React.ReactNode> = {
  1: <IconToolsKitchen2 width={width} height={height} />,
  2: <IconCoffee width={width} height={height} />,
  3: <IconBaguette width={width} height={height} />,
  4: <IconBubbleTea2 width={width} height={height} />,
};

const CompanyAvatar = ({ businessTypeId, imageUrl, size = 40 }: CompanyAvatarProps) => (
  <Avatar
    src={imageUrl || undefined}
    sx={{
      bgcolor: "primary.light",
      color: "primary.main",
      width: size,
      height: size,
    }}
  >
    {!imageUrl && (iconMap[businessTypeId ?? -1] || <IconBuildingCommunity width={24} height={24} />)}
  </Avatar>
);

export default CompanyAvatar;
