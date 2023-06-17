// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: '',
    items: [
      // { title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'Trang chủ', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.dashboard },
      // { title: 'analytics', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics },
      // { title: 'banking', path: PATH_DASHBOARD.general.banking, icon: ICONS.banking },
      // { title: 'booking', path: PATH_DASHBOARD.general.booking, icon: ICONS.booking },
      // { title: 'file', path: PATH_DASHBOARD.general.file, icon: ICONS.file },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Quản trị',
    items: [
      // USER
      {
        title: 'Quản trị người dùng',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          // { title: 'profile', path: PATH_DASHBOARD.user.profile },
          // { title: 'cards', path: PATH_DASHBOARD.user.cards },
          { title: 'Danh sách người dùng', path: PATH_DASHBOARD.user.list },
          { title: 'Thêm tài khoản', path: PATH_DASHBOARD.user.new },
          // { title: 'edit', path: PATH_DASHBOARD.user.demoEdit },
          // { title: 'account', path: PATH_DASHBOARD.user.account },
        ],
      },

      // E-COMMERCE
      {
        title: 'Thương mại điện tử',
        path: PATH_DASHBOARD.eCommerce.root,
        icon: ICONS.cart,
        children: [ 
          { title: 'Nhóm danh mục', path: PATH_DASHBOARD.eCommerce.listCategoryGroup },
          { title: 'Danh mục', path: PATH_DASHBOARD.eCommerce.listCategory },
          { title: 'Thương hiệu', path: PATH_DASHBOARD.eCommerce.listBrand },
          { title: 'Danh sách sản phẩm', path: PATH_DASHBOARD.eCommerce.list },
          { title: 'Tạo sản phẩm mới', path: PATH_DASHBOARD.eCommerce.new },
        ],
      },
      // Sự kiện
      {
        title: 'Sự kiện & Ảnh nỗi bật',
        path: PATH_DASHBOARD.eCommerce.root,
        icon: ICONS.booking,
        children: [
          { title: 'Sự kiện', path: PATH_DASHBOARD.banner.event },
          { title: 'Ảnh nỗi bật', path: PATH_DASHBOARD.banner.highlight },
          { title: 'Kỷ niệm', path: PATH_DASHBOARD.banner.history },
          { title: 'Dòng sản phẩm mới', path: PATH_DASHBOARD.banner.latest },
        ],
      },

      // INVOICE
      {
        title: 'Đơn hàng',
        path: PATH_DASHBOARD.invoice.root,
        icon: ICONS.invoice,
        children: [
          { title: 'Danh sách đơn hàng', path: PATH_DASHBOARD.invoice.list },
          // { title: 'details', path: PATH_DASHBOARD.invoice.demoView },
          // { title: 'create', path: PATH_DASHBOARD.invoice.new },
          // { title: 'edit', path: PATH_DASHBOARD.invoice.demoEdit },
        ],
      },

      // BLOG
    ],
  },
];

export default navConfig;
