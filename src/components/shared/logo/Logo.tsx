"use client";
import { CustomizerContext } from "@/common/contexts/setting/customizerContext";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import config from "@/common/contexts/setting/config";
import Image from "next/image";
import { useContext } from "react";
import { usePathname } from "next/navigation";

const Logo = () => {
  const { isCollapse, isSidebarHover, activeMode } = useContext(CustomizerContext);
  const path = usePathname();
  const url = path.includes("/dashboard") || path.includes("/setting") ? "/dashboard" : "/";
  const TopbarHeight = config.topbarHeight;

  const LinkStyled = styled(Link)(() => ({
    height: TopbarHeight,
    width: isCollapse == "mini-sidebar" && !isSidebarHover ? "40px" : "180px",
    overflow: "hidden",
    display: "block",
  }));

  return (
    <LinkStyled href={url}>
      {activeMode === "dark" ? (
        <Image src="/images/logos/light-logo.svg" alt="logo" height={TopbarHeight} width={174} priority />
      ) : (
        <Image src={"/images/logos/dark-logo.svg"} alt="logo" height={TopbarHeight} width={174} priority />
      )}
    </LinkStyled>
  );
};

export default Logo;
