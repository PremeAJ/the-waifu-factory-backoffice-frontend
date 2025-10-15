"use client"
import { Card } from '@mui/material';
import { useProfile } from '@/common/contexts/ProfileContext';
import { useTheme } from '@mui/material/styles';
import React from 'react';

type Props = {
  className?: string;
  children: React.ReactNode;
  sx?: any;
  [key: string]: any; 
};

const BlankCard = ({ children, className, sx, ...rest }: Props) => {
  const { isCardShadow } = useProfile().appearance;
  
  const theme = useTheme();
  const borderColor = theme.palette.grey[200];

  return (
    <Card
      sx={{ p: 0, border: !isCardShadow ? `1px solid ${borderColor}` : 'none', position: 'relative', ...sx }}
      className={className}
      elevation={isCardShadow ? 9 : 0}
      variant={!isCardShadow ? 'outlined' : undefined}
      {...rest} 
    >
      {children}
    </Card>
  );
};

export default BlankCard;
