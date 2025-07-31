"use client"
import { Card } from '@mui/material';
import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { CustomizerContext } from '@/common/contexts/setting/customizerContext';

type Props = {
  className?: string;
  children: React.ReactNode;
  sx?: any;
  [key: string]: any; // รองรับ prop อื่นๆ เช่น onClick, onMouseEnter ฯลฯ
};

const BlankCard = ({ children, className, sx, ...rest }: Props) => {
  const { isCardShadow } = useContext(CustomizerContext);
  const theme = useTheme();
  const borderColor = theme.palette.grey[200];

  return (
    <Card
      sx={{ p: 0, border: !isCardShadow ? `1px solid ${borderColor}` : 'none', position: 'relative', ...sx }}
      className={className}
      elevation={isCardShadow ? 9 : 0}
      variant={!isCardShadow ? 'outlined' : undefined}
      {...rest} // กระจาย prop อื่นๆ เช่น onClick
    >
      {children}
    </Card>
  );
};

export default BlankCard;
