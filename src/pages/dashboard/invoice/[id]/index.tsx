// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { IInvoiceDetaill } from 'src/@types/invoice';
import { getOderById } from 'src/api/ortherEcom';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// _mock_
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../../components/settings';
// sections
import InvoiceDetails from '../../../../sections/@dashboard/invoice/details';


// ----------------------------------------------------------------------

InvoiceDetailsPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function InvoiceDetailsPage() {
  const { themeStretch } = useSettingsContext();

  const {
    query: { id },
  } = useRouter();

  const [currentInvoice, setCurrentInvoice] = useState<IInvoiceDetaill>()

  useEffect(()=>{
    getOderById(id).then((res)=>{
      if(res?.data?.success === true){
        setCurrentInvoice(res.data)
      }
    })
  },[id])

  return (
    <>
      <Head>
        <title> Invoice: View | Minimal UI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Chi tiết đơn hàng"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            {
              name: 'Đơn hàng',
              href: PATH_DASHBOARD.invoice.root,
            },
            { name: currentInvoice?.order.InvoiceNumber },
          ]}
        />

        {currentInvoice &&
          <InvoiceDetails invoice={currentInvoice} />
        }
      </Container>
    </>
  );
}
