// next
import Head from 'next/head';
import NextLink from 'next/link';
// @mui
import { Link, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from '../../routes/paths';
// layouts
import CompactLayout from '../../layouts/compact';
// components
import Iconify from '../../components/iconify';
// sections
import AuthResetPasswordForm from '../../sections/auth/AuthResetPasswordForm';
// assets
import { PasswordIcon } from '../../assets/icons';

// ----------------------------------------------------------------------

ResetPasswordPage.getLayout = (page: React.ReactElement) => <CompactLayout>{page}</CompactLayout>;

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  return (
    <>
      <Head>
        <title> Đổi mật mật khẩu | Bách hóa Ngọc Diệp</title>
      </Head>

      <PasswordIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" paragraph>
      Quên mật khẩu?
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        Vui lòng nhập địa chỉ email được liên kết với tài khoản của bạn và Chúng tôi sẽ gửi email cho bạn một liên kết đến 
        Đặt lại mật khẩu của bạn.
      </Typography>

      <AuthResetPasswordForm />

      <Link
        component={NextLink}
        href={PATH_AUTH.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          mt: 3,
          mx: 'auto',
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:chevron-left-fill" width={16} />
        Quay lại đăng nhập
      </Link>
    </>
  );
}
