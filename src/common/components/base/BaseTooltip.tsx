import Tooltip, { TooltipProps } from '@mui/material/Tooltip';

const BaseTooltip = (props: TooltipProps) => (
  <Tooltip placement="top" {...props} />
);

export default BaseTooltip;