import { ListItemButtonProps } from '@mui/material';

// ----------------------------------------------------------------------

export type NavItemProps = {
  title: string;
  path: string;
  icon?: React.ReactElement;
  children?: Children[];
};

type Item = {
  title: string;
  path: string;
};
type Children = {
  subheader: string;
  items: Item[];
};
export interface NavItemDesktopProps extends ListItemButtonProps {
  item: NavItemProps;
  isOffset?: boolean;
  active?: boolean;
  open?: boolean;
  subItem?: boolean;
  isExternalLink?: boolean;
}

export interface NavItemMobileProps extends ListItemButtonProps {
  item: NavItemProps;
  active?: boolean;
  open?: boolean;
  isExternalLink?: boolean;
}

export type NavProps = {
  isOffset: boolean;
  data: NavItemProps[];
};
