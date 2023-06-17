// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import { Box, Grid, Link, Stack, Divider, Container, Typography, IconButton } from '@mui/material';
// routes
import { PATH_PAGE } from '../../routes/paths';
// _mock
import { _socials } from '../../_mock/arrays';
// components
import Logo from '../../components/logo';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: 'Minimal',
    children: [
      { name: 'About us', href: PATH_PAGE.about },
      { name: 'Contact us', href: PATH_PAGE.contact },
      { name: 'FAQs', href: PATH_PAGE.faqs },
    ],
  },
  {
    headline: 'Legal',
    children: [
      { name: 'Terms and Condition', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ],
  },
  {
    headline: 'Liên hệ',
    children: [
      { name: 'support@minimals.cc', href: '#' },
      { name: 'Số điện thoại: 0397516328', href: '#' },
      { name: 'Los Angeles, 359  Hidden Valley Road', href: '#' },
    ],
  },
];

// ----------------------------------------------------------------------

export default function Footer() {
  const { pathname } = useRouter();

  const isHome = pathname === '/';

  const simpleFooter = (
    <Box
      component="footer"
      sx={{
        py: 5,
        textAlign: 'center',
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Container>
        <Logo sx={{ mb: 1, mx: 'auto' }} />

        <Typography variant="caption" component="div">
          © All rights reserved
          <br /> made by &nbsp;
          <Link href="https://minimals.cc/"> minimals.cc </Link>
        </Typography>
      </Container>
    </Box>
  );

  const mainFooter = (
    <Box
      // component="footer"
      sx={{
        position: 'relative',
        // bgcolor: 'background.default',

        pt: 10,
        pr: 10,
        pl: 10,
      }}
    >
      <Divider />

      <Grid
        container
        xs={20}
        justifyContent={{
          xs: 'center',
          md: 'space-between',
        }}
        sx={{
          textAlign: {
            xs: 'center',
            md: 'left',
          },
        }}
      >
        <Grid item xs={20} sx={{ mb: 3 }}>
          <Logo sx={{ mx: { xs: 'auto', md: 'inherit' } }} />
        </Grid>

        <Grid item xs={8} md={3}>
          <Typography variant="body1" sx={{ pr: { md: 5 } }}>
            Bách hóa Ngọc Diệp chuyên cung cấp sỉ và lẻ sữa bột và hàng tạp hóa, luôn đặt uy tín và
            chất lượng lên hàng đầu
          </Typography>
          <Stack
            spacing={1}
            direction="row"
            sx={{
              mt: 5,
            
              alignItems: 'center',
              alignContent: 'center',
            }}
          >
            <Typography variant="h6">Số điện thoại:</Typography>
            <Typography variant="body2">0397516328</Typography>
          </Stack>
          <Stack
            spacing={1}
            direction="row"
            sx={{
              mt: 2,
            
              alignItems: 'center',
              alignContent: 'center',
            }}
          >
            <Typography variant="h6">Gmail:</Typography>
            <Typography variant="body2">trongqui2712@gmail.com</Typography>
          </Stack>
          <Stack
            spacing={1}
            direction="row"
            sx={{
              mt: 2,
            
              alignItems: 'center',
              alignContent: 'center',
            }}
          >
            <Typography variant="h6">Địa chỉ:</Typography>
            <Typography variant="body2">đường 30/4, phường 5, thị xã Cai Lậy, tỉnh Tiền Giang</Typography>
          </Stack>

          <Stack
            spacing={1}
            direction="row"
            justifyContent={{ xs: 'center', md: 'flex-start' }}
            sx={{
              mt: 5,
              mb: { xs: 5, md: 0 },
            }}
          >
            {_socials.map((social) => (
              <IconButton key={social.name} href={social.path}  target="_blank">
                <Iconify icon={social.icon} />
              </IconButton>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={7}>
          <Stack spacing={5} justifyContent="space-between" direction={{ xs: 'column', md: 'row' }}>
            {LINKS.map((list) => (
              <Stack
                key={list.headline}
                spacing={2}
                alignItems={{ xs: 'center', md: 'flex-start' }}
              >
                <Typography component="div" variant="overline">
                  {list.headline}
                </Typography>

                {list.children.map((link) => (
                  <Link
                    key={link.name}
                    component={NextLink}
                    href={link.href}
                    color="inherit"
                    variant="body2"
                  >
                    {link.name}
                  </Link>
                ))}
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Grid>

      <Typography
        variant="caption"
        component="div"
        sx={{
          mt: 10,
          pb: 5,
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        © 2021. All rights reserved
      </Typography>
    </Box>
  );

  return !isHome ? simpleFooter : mainFooter;
}
