import Avatar from "@mui/material/Avatar";
import { Skeleton } from "@mui/material";
import { renderTablerIcon } from "@/common/utils/icon/getTablerIcon";

type CompanyAvatarProps = {
  imageUrl?: string;
  size?: number;
  loading?: boolean;
  icon: string;
};

const CompanyAvatar = ({ imageUrl, size = 40, loading = false, icon }: CompanyAvatarProps) => {
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
      {!imageUrl && renderTablerIcon(icon, { width: 24, height: 24 })}
    </Avatar>
  );
};

export default CompanyAvatar;
