import Avatar from "@mui/material/Avatar";
import { IconBuildingCommunity, IconToolsKitchen2, IconCoffee, IconBaguette, IconBubbleTea2 } from "@tabler/icons-react";

type CompanyAvatarProps = {
  businessTypeId?: number;
  imageUrl?: string;
  size?: number;
};

const iconSize = {
  width: 24,
  height: 24
}

const iconMap: Record<number, React.ReactNode> = {
  1: <IconToolsKitchen2 {...iconSize} />,
  2: <IconCoffee {...iconSize} />,
  3: <IconBaguette {...iconSize} />,
  4: <IconBubbleTea2 {...iconSize} />,
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
    {!imageUrl && (iconMap[businessTypeId ?? -1] || <IconBuildingCommunity {...iconSize} />)}
  </Avatar>
);

export default CompanyAvatar;
