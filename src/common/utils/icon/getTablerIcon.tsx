import { mapBusinessType } from '@/common/constants/icon/mapBusinessType';
import {
  IconToolsKitchen2,
  IconCoffee,
  IconPizza,
  IconCake,
  IconMeat,
  IconSalad,
  IconToolsKitchen,
  IconSoup,
  IconFish,
  IconGlassFull,
  IconQuestionMark,
} from '@tabler/icons-react';
import { ReactElement } from 'react';

const ICON_MAP: Record<string, any> = {
  food: IconToolsKitchen2,
  coffee: IconCoffee,
  pizza: IconPizza,
  cake: IconCake,
  meat: IconMeat,
  salad: IconSalad,
  utensils: IconToolsKitchen,
  soup: IconSoup,
  fish: IconFish,
  wine: IconGlassFull,
};

export const getTablerIcon = (iconName: string) => {
  return ICON_MAP[iconName] || IconQuestionMark;
};

export const renderTablerIcon = (iconName: string, props?: any): ReactElement => {
  const IconComponent = getTablerIcon(iconName);
  return <IconComponent size={16} {...props} />;
};

export const getIconMapByBusinessType = (businessTypeId: number) => {
  return mapBusinessType[businessTypeId]
}