// next
import Head from 'next/head';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import ProductNewEditForm from '../../../../sections/@dashboard/e-commerce/ProductNewEditForm';

// ----------------------------------------------------------------------

EcommerceProductCreatePage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function EcommerceProductCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title> Tạo sản phẩm | Bách hóa Ngọc Diệp</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Thêm sản phẩm"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            {
              name: 'Danh sách',
              href: PATH_DASHBOARD.eCommerce.list,
            },
            { name: 'Tạo sản phẩm' },
          ]}
        />
        <ProductNewEditForm />
      </Container>
    </>
  );
}
