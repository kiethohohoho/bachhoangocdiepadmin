// next
import NextLink from 'next/link';
// @mui
import { Stack, Typography, Link } from '@mui/material';
// layouts
import LoginLayout from '../../layouts/login';
// routes
import { PATH_AUTH } from '../../routes/paths';
//
import AuthWithSocial from './AuthWithSocial';
import AuthRegisterForm from './AuthRegisterForm';

// ----------------------------------------------------------------------

export default function Register() {
  return (
    <LoginLayout title="Mua càng nhiều lời càng nhiều với bách hóa Ngọc Diệp">
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Đăng ký tài khoản mua hàng</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2"> Bạn đã có tài khoản? </Typography>

          <Link component={NextLink} href={PATH_AUTH.login} variant="subtitle2">
            Đăng nhập
          </Link>
        </Stack>
      </Stack>

      <AuthRegisterForm />

      {/* <Typography
        component="div"
        sx={{ color: 'text.secondary', mt: 3, typography: 'caption', textAlign: 'center' }}
      >
        {'By signing up, I agree to '}
        <Link underline="always" color="text.primary">
          Terms of Service
        </Link>
        {' and '}
        <Link underline="always" color="text.primary">
          Privacy Policy
        </Link>
        .
      </Typography> */}

      {/* <AuthWithSocial /> */}
    </LoginLayout>
  );
}
