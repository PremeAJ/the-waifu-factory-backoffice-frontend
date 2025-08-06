import { ReactElement } from 'react';
import * as tablerIcons from '@tabler/icons-react';

export const getTablerIcon = (iconName: string) => {
  const icon = (tablerIcons as any)[iconName];
  return icon || tablerIcons.IconQuestionMark;
};

export const renderTablerIcon = (iconName: string, props?: any): ReactElement => {
  const IconComponent = getTablerIcon(iconName);
  return <IconComponent size={16} {...props} />;
};

