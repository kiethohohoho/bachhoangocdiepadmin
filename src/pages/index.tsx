import Head from 'next/head';
import Login from 'src/sections/auth/Login';
import GuestGuard from 'src/auth/GuestGuard';
// @mui
// layouts
import MainLayout from '../layouts/main';


// ----------------------------------------------------------------------

HomePage.getLayout = (page: React.ReactElement) => <MainLayout> {page} </MainLayout>;

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Head>
        <title> Bách hóa ngọc diệp | cửa hàng</title>
      </Head>
      <GuestGuard><Login /></GuestGuard>
      
    </>
  );
}
