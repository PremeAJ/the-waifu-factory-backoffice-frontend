'use client'
import { Card,  Typography, Stack, Box } from '@mui/material';
import { useProfile } from '@/common/contexts/ProfileContext';
import { useTheme } from '@mui/material/styles';
import BaseCardContent from '@/common/components/base/BaseCardContent';
import BaseCard from '@/common/components/base/BaseCard';

type Props = {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode | any;
  footer?: React.ReactNode;
  cardheading?: string | React.ReactNode;
  headtitle?: string | React.ReactNode;
  headsubtitle?: string | React.ReactNode;
  children?: React.ReactNode;
  middlecontent?: string | React.ReactNode;
};

const DashboardCard = ({
  title,
  subtitle,
  children,
  action,
  footer,
  cardheading,
  headtitle,
  headsubtitle,
  middlecontent,
}: Props) => {
const { isCardShadow } = useProfile().appearance;

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  return (
    <BaseCard
      sx={{ padding: 0, border: !isCardShadow ? `1px solid ${borderColor}` : 'none' }}
      elevation={isCardShadow ? 9 : 0}
      variant={!isCardShadow ? 'outlined' : undefined}
    >
      {cardheading ? (
        <BaseCardContent>
          <Typography variant="h5">{headtitle}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {headsubtitle}
          </Typography>
        </BaseCardContent>
      ) : (
        <BaseCardContent sx={{ p: "30px" }}>
          {title ? (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems={'center'}
              mb={3}
            >
              <Box>
                {title ? <Typography variant="h5">{title}</Typography> : ''}

                {subtitle ? (
                  <Typography variant="subtitle2" color="textSecondary">
                    {subtitle}
                  </Typography>
                ) : (
                  ''
                )}
              </Box>
              {action}
            </Stack>
          ) : null}

          {children}
        </BaseCardContent>
      )}

      {middlecontent}
      {footer}
    </BaseCard>
  );
};

export default DashboardCard;
