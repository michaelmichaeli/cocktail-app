import { FC } from 'react';
import { GlassesIcon, UtensilsIcon, BeakerIcon } from 'lucide-react';

interface FilterIconProps {
  icon: typeof BeakerIcon | typeof GlassesIcon | typeof UtensilsIcon;
}

export const FilterIcon: FC<FilterIconProps> = ({ icon: Icon }) => {
  return <Icon size={24} />;
};

export const filterIcons = {
  ingredient: <FilterIcon icon={BeakerIcon} />,
  glass: <FilterIcon icon={GlassesIcon} />,
  category: <FilterIcon icon={UtensilsIcon} />
}; 