// routes
import { PATH_AUTH, PATH_DASHBOARD, PATH_DOCS, PATH_PAGE } from '../../../routes/paths';
// config
import { PATH_AFTER_LOGIN } from '../../../config-global';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'Home',
    icon: <Iconify icon="eva:home-fill" />,
    path: PATH_DASHBOARD.eCommerce.shop,
  },
  {
    title: 'Giỏ hàng',
    icon: <Iconify icon="ic:round-grain" />,
    path: PATH_DASHBOARD.eCommerce.checkout,
  },
  {
    title: 'Documentation',
    icon: <Iconify icon="eva:book-open-fill" />,
    path: PATH_DOCS.root,
  },
];

export default navConfig;
