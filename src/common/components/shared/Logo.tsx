"use client";
import { PageUrl } from "@/common/constants/pageUrl";
import { styled } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import { useProfile } from "@/common/contexts/ProfileContext";
import Image from "next/image";
import Link from "next/link";

type LogoSize = "small" | "medium" | "large";

interface LogoProps {
  size?: LogoSize;
}

const sizeMap = {
  small: { height: 40, width: 40 },
  medium: { height: 70, width: 70 },
  large: { height: 100, width: 100 },
};

const Logo = ({ size = "medium" }: LogoProps) => {
  const {activeMode } = useProfile().appearance;
  const path = usePathname();
  const url =
    path.includes(PageUrl.HOME) || path.includes("/setting")
      ? PageUrl.HOME
      : "/";
  const { height, width } = sizeMap[size];
  const LinkStyled = styled(Link)(() => ({
    height,
    width,
    overflow: "hidden",
    display: "block",
  }));

  return (
    <LinkStyled href={url}>
      {activeMode === "dark" ? (
        <Image
          src="/images/logos/logo.png"
          alt="logo"
          height={height}
          width={width === 70 ? 174 : width}
          priority
        />
      ) : (
        <Image
          src={"/images/logos/logo.png"}
          alt="logo"
          height={height}
          width={width}
          priority
        />
      )}
    </LinkStyled>
  );
};

export default Logo;
