// @mui
import { Box, Button, Card, Divider, Stack, Typography } from '@mui/material';
// @types

import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { IAddress } from 'src/@types/product';
import { addAddress, deleteAddress, updateAddress } from 'src/api/ortherEcom';
// import { CheckoutBillingNewAddressForm } from 'src/sections/@dashboard/e-commerce/checkout';
import { useAuthContext } from 'src/auth/useAuthContext';
import BillingEditAddressForm from './BillingEditAddressForm';

 import { IUserAccountBillingAddress } from '../../../../../@types/user';
// components

import Iconify from '../../../../../components/iconify';


type Props = {
  addressBook: IUserAccountBillingAddress[];
};

export default function AccountBillingAddressBook({ addressBook }: Props) {
  const { initialize } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const handleCreateBilling = (address: IAddress) => {
    addAddress(address)
      .then((res) => {
        if (res?.data?.success === true) {
          enqueueSnackbar('Thêm địa chỉ thành công!');
          initialize();
          handleClose();
        } else {
          enqueueSnackbar('Đã có lỗi xảy ra!', { variant: 'error' });
        }
      })
      .catch((err) => enqueueSnackbar('Đã có lỗi xảy ra!', { variant: 'error' }));

    // // dispatch(nextStep());
  };

  const handleUpateBilling = (address: IAddress, id: string) => {
    updateAddress(address, id)
      .then((res) => {
        if (res?.data?.success === true) {
          enqueueSnackbar('Sửa địa chỉ thành công!');
          initialize();
          handleCloseUpdate();
        } else {
          enqueueSnackbar('Đã có lỗi xảy ra!', { variant: 'error' });
        }
      })
      .catch((err) => enqueueSnackbar('Đã có lỗi xảy ra!', { variant: 'error' }));

    // // dispatch(nextStep());
  };

  const handleDeleteBilling = (id?: string) => {
    deleteAddress(id)
      .then((res) => {
        if (res?.data?.success === true) {
          enqueueSnackbar('Xóa địa chỉ thành công!');
          initialize();
        } else {
          enqueueSnackbar('Đã có lỗi xảy ra!', { variant: 'error' });
        }
      })
      .catch((err) => enqueueSnackbar('Đã có lỗi xảy ra!', { variant: 'error' }));

    // // dispatch(nextStep());
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          ĐỊA CHỈ NHẬN HÀNG MẶT ĐỊNH
        </Typography>

        {addressBook[0] == null && (
          <>
            <Button onClick={handleOpen} size="small" startIcon={<Iconify icon="eva:plus-fill" />}>
              New Billing Address
            </Button>
            {/* <CheckoutBillingNewAddressForm
              open={open}
              onClose={handleClose}
              onCreateBilling={handleCreateBilling}
            /> */}
          </>
        )}
      </Stack>

      <Stack spacing={3} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
        {addressBook[0] != null &&
          addressBook?.map((address: any) => (
            <Stack key={address?.Id} spacing={1}>
              <Typography variant="subtitle1">{address?.ReceiverName}</Typography>

              <Typography variant="body2">
                <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>
                  Địa chỉ:
                </Box>
                {`${address?.Street}, ${address?.Ward}, ${address?.District},  ${address?.City}`}
              </Typography>

              <Typography variant="body2">
                <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>
                  Số điện thoại:
                </Box>
                {address?.ReceiverPhoneNumber}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Button
                  onClick={() => handleDeleteBilling(address?.Id)}
                  color="error"
                  size="small"
                  startIcon={<Iconify icon="eva:trash-2-outline" />}
                >
                  Xóa
                </Button>

                <Button
                  onClick={() => setOpenUpdate(true)}
                  size="small"
                  startIcon={<Iconify icon="eva:edit-fill" />}
                >
                  Sửa
                </Button>
                <BillingEditAddressForm
                  open={openUpdate}
                  onClose={handleCloseUpdate}
                  onUpateBilling={handleUpateBilling}
                  addressItem={address}
                />
              </Stack>
            </Stack>
          ))}
      </Stack>
    </Card>
  );
}
