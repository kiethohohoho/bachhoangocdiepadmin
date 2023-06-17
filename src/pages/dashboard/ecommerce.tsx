// next
import Head from 'next/head';
// @mui
import { Button, Container, Grid, Pagination, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { IInvoice } from 'src/@types/invoice';
import {
  getAmountByPaidType,
  getOderBySratus1,
  getThreeBestSellingProducts,
  getsaleproducttoday,
} from 'src/api/ortherEcom';
import { PATH_DASHBOARD } from 'src/routes/paths';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// _mock_
import { _ecommerceLatestProducts, _ecommerceSalesOverview } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import { AppWelcome } from '../../sections/@dashboard/general/app';
import {
  EcommerceBestSalesman,
  EcommerceCurrentBalance,
  EcommerceLatestProducts,
  EcommerceSaleByGender,
  EcommerceSalesOverview,
  EcommerceWidgetSummary,
  EcommerceYearlySales,
} from '../../sections/@dashboard/general/e-commerce';
// assets
import { MotivationIllustration } from '../../assets/illustrations';

// ----------------------------------------------------------------------

GeneralEcommercePage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------
type IGetsaleProductToday = {
  success: boolean;
  revenueToday: number;
  revenueYesterday: number;
  ratio: number;
};

type IAmountByPaidType = {
  amountByCash: number;
  amountByTransfer: number;
  success: boolean;
  total: number;
};
type IProductBestSeler = {
  allProductsCount: number;
  bestSellingProducts: {
    Name: string;
    ProductId: string;
    Total: number;
  }[];
};

export default function GeneralEcommercePage() {
  const { user } = useAuthContext();

  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  const [saleproducttoday, setSaleProductToday] = useState<IGetsaleProductToday>();
  const [amountByPaidType, setAmountByPaidType] = useState<IAmountByPaidType>();
  const [threeBestSellingProducts, setThreeBestSellingProducts] = useState<IProductBestSeler>();
  const [oders, setOders] = useState<IInvoice[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<{
    TotalCount: number;
    TotalPages: number;
    CurrentPage: number;
    Limit: number;
  }>({
    TotalCount: 0,
    TotalPages: 0,
    CurrentPage: 0,
    Limit: 0,
  });

  const renderCash = () => {
    const a = Number(amountByPaidType?.amountByCash);
    const b = Number(amountByPaidType?.amountByTransfer);

    return Math.round(Math.abs((a / (a + b)) * 100) * 100) / 100;
  };

  useEffect(() => {
    getsaleproducttoday().then((res) => {
      setSaleProductToday(res.data);
    });
    getAmountByPaidType().then((res) => {
      setAmountByPaidType(res.data);
    });
    getThreeBestSellingProducts().then((res) => {
      setThreeBestSellingProducts(res.data);
    });
  }, []);

  useEffect(() => {
    getOderBySratus1(page).then((res) => {
      setOders(res.data.Orders.Data);
      setPagination(res.data.Orders.Pagination);
    });
  }, [page]);

  const isColor =
    Number(saleproducttoday?.revenueToday) > Number(saleproducttoday?.revenueYesterday);

  const renderText = () => {
    if (Number(saleproducttoday?.revenueToday === Number(saleproducttoday?.revenueYesterday))) {
      return 'bằng';
    }
    if (Number(saleproducttoday?.revenueToday) > Number(saleproducttoday?.revenueYesterday)) {
      return 'tăng';
    }
    return 'giảm';
  };

  return (
    <>
      <Head>
        <title> Bách hóa Ngọc Diệp</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid md={8}>
          {!!saleproducttoday && (
            <AppWelcome
              title={`Chúc mừng! \n ${user?.general?.FullName}`}
              description={`Tính đến hiện tại bạn đã bán được ${
                saleproducttoday.revenueToday === null ? 0 : saleproducttoday?.revenueToday
              } ${renderText()} ${
                saleproducttoday.ratio === null
                  ? 0
                  : Math.round(saleproducttoday.ratio * 100 * 100) / 100
              }% so với hôm trước.`}
              img={
                <MotivationIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                    color: isColor ? '#005249' : '#D82D19',
                  }}
                />
              }
              action={
                <Button href={PATH_DASHBOARD.invoice.list} variant="contained">
                  Xem ngay
                </Button>
              }
            />
          )}
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <EcommerceWidgetSummary
              title="Sản phẩm đã bán"
              percent={2.6}
              total={765}
              chart={{
                colors: [theme.palette.primary.main],
                series: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <EcommerceWidgetSummary
              title="Tổng số dư"
              percent={-0.1}
              total={18765}
              chart={{
                colors: [theme.palette.info.main],
                series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 68],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <EcommerceWidgetSummary
              title="Lợi nhuận bán hàng"
              percent={0.6}
              total={4876}
              chart={{
                colors: [theme.palette.warning.main],
                series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <EcommerceSaleByGender
              title="Hình thức thanh toán"
              total={Number(amountByPaidType?.total) || 0}
              chart={{
                series: [
                  { label: 'Tiền mặt', value: renderCash() },
                  { label: 'Chuyển khoản', value: 100 - renderCash() },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <EcommerceBestSalesman
              title="Đơn hàng chờ duyệt"
              tableData={oders}
              tableLabels={[
                { id: 'nguoidat', label: 'Người đặt' },
                { id: 'product', label: 'Số điện thoại' },
                { id: 'country', label: 'Ngày đặt', align: 'left' },
                { id: 'total', label: 'Tổng tiền' },
                { id: 'rank', label: 'Trạng thái', align: 'center' },
              ]}
            />
            {pagination?.TotalPages > 1 && (
              <Stack
                alignItems={{
                  xs: 'center',
                  md: 'flex-end',
                }}
                sx={{
                  my: 2,
                  mr: { md: 2 },
                }}
              >
                <Pagination
                  count={pagination?.TotalPages}
                  variant="outlined"
                  shape="rounded"
                  onChange={(e, p: number) => {
                    setPage(p);
                  }}
                />
              </Stack>
            )}
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            {!!threeBestSellingProducts && (
              <EcommerceSalesOverview
                title="Tổng quan về bán hàng"
                data={threeBestSellingProducts}
              />
            )}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <EcommerceCurrentBalance
              title="Số dư hiện tại"
              currentBalance={187650}
              sentAmount={25500}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <EcommerceYearlySales
              title="Doanh số hàng năm"
              subheader="(+43%) so với năm trước"
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                series: [
                  {
                    year: '2019',
                    data: [
                      { name: 'Tổng thu nhập', data: [10, 41, 35, 151, 49, 62, 69, 91, 48] },
                      { name: 'Tổng chi phí', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
                    ],
                  },
                  {
                    year: '2020',
                    data: [
                      { name: 'Tổng thu nhập', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
                      { name: 'Tổng chi phí', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
                    ],
                  },
                ],
              }}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <EcommerceLatestProducts title="Sản phẩm mới nhất" list={_ecommerceLatestProducts} />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
