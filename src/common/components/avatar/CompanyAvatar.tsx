import Avatar from "@mui/material/Avatar";
import { Skeleton } from "@mui/material";
import {
  IconBuildingCommunity,
  IconToolsKitchen2,
  IconCoffee,
  IconBaguette,
  IconBubbleTea2,
  IconShoppingCart,
  IconBasket,
  IconBooks,
  IconPillFilled,
  IconWashMachine,
  IconEyeClosed,
  IconDeviceTabletCog,
  IconDeviceAirpods,
  IconPaperclip,
  IconMassage,
  IconSparkles,
  IconShirt,
  IconShoe,
  IconLuggage,
} from "@tabler/icons-react";

type CompanyAvatarProps = {
  businessTypeId?: number;
  imageUrl?: string;
  size?: number;
  loading?: boolean;
};

const iconSize = {
  width: 24,
  height: 24,
};

const iconMap: Record<number, React.ReactNode> = {
  1: <IconToolsKitchen2 {...iconSize} />,
  2: <IconCoffee {...iconSize} />,
  3: <IconBaguette {...iconSize} />,
  4: <IconBubbleTea2 {...iconSize} />,
  5: <IconShoppingCart {...iconSize} />,
  6: <IconBasket {...iconSize} />,
  7: <IconBooks {...iconSize} />,
  8: <IconDeviceTabletCog {...iconSize} />,
  9: <IconPillFilled {...iconSize} />,
  10: <IconWashMachine {...iconSize} />,
  11: <IconEyeClosed {...iconSize} />,
  12: <IconDeviceAirpods {...iconSize} />,
  13: <IconPaperclip {...iconSize} />,
  14: <IconSparkles {...iconSize} />,
  15: <IconMassage {...iconSize} />,
  16: <IconShirt {...iconSize} />,
  17: <IconShoe {...iconSize} />,
  18: <IconLuggage {...iconSize} />,
};

const CompanyAvatar = ({ businessTypeId, imageUrl, size = 40, loading = false }: CompanyAvatarProps) => {
  if (loading) {
    return <Skeleton variant="circular" width={size} height={size} />;
  }

  return (
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
};

export default CompanyAvatar;
