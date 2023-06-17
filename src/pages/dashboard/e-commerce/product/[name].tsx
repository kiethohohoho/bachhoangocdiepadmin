import { useEffect, useState } from 'react';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Box, Card, Container, Divider, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
// redux
import { useSnackbar } from 'notistack';
import { IDataAddCart } from 'src/@types/product';
import { addToCart, getCarts, getProduct, gotoStep } from '../../../../redux/slices/product';
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// @types
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import Iconify from '../../../../components/iconify';
import Markdown from '../../../../components/markdown';
import { useSettingsContext } from '../../../../components/settings';
import { SkeletonProductDetails } from '../../../../components/skeleton';
// sections
import {
  ProductDetailsCarousel,
  ProductDetailsReview,
  ProductDetailsSummary,
} from '../../../../sections/@dashboard/e-commerce/details';

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: '100% Original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'ic:round-verified',
  },
  {
    title: '10 Day Replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'eva:clock-fill',
  },
  {
    title: 'Year Warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'ic:round-verified-user',
  },
];

// ----------------------------------------------------------------------

EcommerceProductDetailsPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function EcommerceProductDetailsPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const {
    query: { name },
  } = useRouter();

  const dispatch = useDispatch();

  const { product, isLoading, checkout, reviewState } = useSelector((state) => state.product);

  const [currentTab, setCurrentTab] = useState('description');
 
  useEffect(() => {
 
    if (name) {
      dispatch(getProduct(name as string));
    }
  }, [dispatch, name]);

  const handleAddCart = (cart: IDataAddCart) => {
    addToCart(cart)
      .then((res) => {
        if (res?.data?.success === true) {
          dispatch(getCarts());
          enqueueSnackbar('Thêm vào giỏ hàng thành công!');
        } else {
          enqueueSnackbar('Thêm vào giỏ hàng không thành công!');
        }
      })
      .catch(() => {
        enqueueSnackbar('Thêm vào giỏ hàng không thành công!');
      });
  };

  const handleGotoStep = (step: number) => {
    dispatch(gotoStep(step));
  };

  const TABS = [
    {
      value: 'description',
      label: 'description',
      component: product ? <Markdown children={product?.Description} /> : null,
    },
    {
      value: 'reviews',
      label: 'Reviews',
      component: product ? <ProductDetailsReview reviewsdata={reviewState} /> : null,
    },
  ];

  return (
    <>
      <Head>
        <title>{`Sản phẩm: ${product?.Name || ''} | Minimal UI`}</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          // heading="Thông tin sản phẩm"
          links={[
            { name: 'Trang chủ', href: "/" },
            {
              name: 'Cửa hàng',
              href: PATH_DASHBOARD.eCommerce.shop,
            },
            { name: product?.Name },
          ]}
        />

        {product && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={7}>
                <ProductDetailsCarousel productId={name} />
              </Grid>

              <Grid item xs={12} md={6} lg={5}>
                <ProductDetailsSummary
                  product={product}
                  cart={checkout?.cart}
                  onAddCart={handleAddCart}
                  onGotoStep={handleGotoStep}
                />
              </Grid>
            </Grid>

            <Box
              gap={5}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
              sx={{ my: 10 }}
            >
              {SUMMARY.map((item) => (
                <Box key={item.title} sx={{ textAlign: 'center' }}>
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      borderRadius: '50%',
                      color: 'primary.main',
                      bgcolor: (theme) => `${alpha(theme.palette.primary.main, 0.08)}`,
                    }}
                  >
                    <Iconify icon={item.icon} width={36} />
                  </Stack>

                  <Typography variant="h6" sx={{ mb: 1, mt: 3 }}>
                    {item.title}
                  </Typography>

                  <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
                </Box>
              ))}
            </Box>

            <Card>
              <Tabs
                value={currentTab}
                onChange={(event, newValue) => setCurrentTab(newValue)}
                sx={{ px: 3, bgcolor: 'background.neutral' }}
              >
                {TABS.map((tab) => (
                  <Tab key={tab.value} value={tab.value} label={tab.label} />
                ))}
              </Tabs>

              <Divider />

              {TABS.map(
                (tab) =>
                  tab.value === currentTab && (
                    <Box
                      key={tab.value}
                      sx={{
                        ...(currentTab === 'description' && {
                          p: 3,
                        }),
                      }}
                    >
                      {tab.component}
                    </Box>
                  )
              )}
            </Card>
          </>
        )}

        {isLoading && <SkeletonProductDetails />}
      </Container>
    </>
  );
}
