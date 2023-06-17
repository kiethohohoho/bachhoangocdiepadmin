import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Stack,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// @types
import { useEffect, useState } from 'react';
import { getDistrict, getProvince, getWard } from 'src/api/ortherEcom';
import { IAddress, ICheckoutBillingAddress } from '../../../../../@types/product';
// assets
import { countries } from '../../../../../assets/data';
import FormProvider, {
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
  RHFRadioGroup,
} from '../../../../../components/hook-form';


// ----------------------------------------------------------------------
type Props = {
  open: boolean;
  addressItem: IAddress;
  onClose: VoidFunction;
  onUpateBilling: (address: IAddress, id: string) => void;
};

export default function BillingEditAddressForm({ open, onClose, onUpateBilling, addressItem }: Props) {
  const NewAddressSchema = Yup.object().shape({
    Name: Yup.string().required('Trường này bắt buộc'),
    ReceiverName: Yup.string().required('Trường này bắt buộc'),
    City: Yup.string().required('Trường này bắt buộc'),
    Ward: Yup.string().required('Trường này bắt buộc'),
    Street: Yup.string().required('Trường này bắt buộc'),
    District: Yup.string().required('Trường này bắt buộc'),
    ReceiverPhoneNumber: Yup.string().required('Trường này bắt buộc'),
  });

  const defaultValues = {
    Name: addressItem.Name || '',
    IsDefault: addressItem.IsDefault || true,
    City: addressItem.City || '',
    District: addressItem.District || '',
    Ward: addressItem.Ward || '',
    Street: addressItem.Street || '',
    ReceiverName:addressItem.ReceiverName || '',
    ReceiverPhoneNumber: addressItem.ReceiverPhoneNumber || '',
  };

  const methods = useForm<IAddress>({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: IAddress) => {
    const body: IAddress = {
      Name: data?.Name,
      IsDefault: data?.IsDefault,
      City: JSON.parse(data?.City).name,
      District: JSON.parse(data?.District).name,
      Ward: JSON.parse(data?.Ward).name,
      Street: data?.Street,
      ReceiverName: data?.ReceiverName,
      ReceiverPhoneNumber: data?.ReceiverPhoneNumber,
      CityGHNId: JSON.parse(data?.City).id || 0,
      DistrictGHNId: JSON.parse(data?.District).id || 0,
      WardGHNid: JSON.parse(data?.Ward).id || 0,
    };
    try {
      onUpateBilling(body, addressItem.Id || '');
    } catch (error) {
      console.error(error);
    }
  };

  const [provinces, setProvinces] = useState<any>([]);
  const [districts, setDistricts] = useState<any>([]);
  const [wards, setWards] = useState<any>([]);

  useEffect(() => {
    getProvince().then((res) => {
      if (res?.data?.message === 'Success') {
        setProvinces(res.data.data);
      }
    });
  }, []);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Thêm địa chỉ mới</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <RHFRadioGroup
              row
              name="Name"
              options={[
                { label: 'Nhà riêng ', value: 'home' },
                { label: 'Văn phòng', value: 'office' },
              ]}
            />
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="ReceiverName" label="Tên người nhận" />
              <RHFTextField name="ReceiverPhoneNumber" label="Số điện thoại" />
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFSelect
                native
                onChange={(e) => {
                  setValue('City', e.target.value);
                  getDistrict(JSON.parse(e.target.value).id).then((res) => {
                    if (res?.data?.message === 'Success') {
                      setDistricts(res.data.data);
                    }
                  });
                }}
                name="City"
                label="Tỉnh / Thành phố"
              >
                <option value="" />
                {provinces?.map((province: any) => (
                  <option
                    key={province.ProvinceID}
                    value={JSON.stringify({ id: province.ProvinceID, name: province.ProvinceName })}
                  >
                    {province.ProvinceName}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect
                native
                onChange={(e) => {
                  setValue('District', e.target.value);
                  getWard(JSON.parse(e.target.value).id).then((res) => {
                    if (res?.data?.message === 'Success') {
                      setWards(res.data.data);
                    }
                  });
                }}
                name="District"
                label="Huyện / Quận"
              >
                <option value="" />
                {districts?.map((district: any) => (
                  <option
                    key={district.DistrictID}
                    value={JSON.stringify({ id: district.DistrictID, name: district.DistrictName })}
                  >
                    {district.DistrictName}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect native name="Ward" label="Xã / Phường">
                <option value="" />
                {wards?.map((ward: any) => (
                  <option
                    key={ward.WardCode}
                    value={JSON.stringify({ id: ward.WardCode, name: ward.WardName })}
                  >
                    {ward.WardName}
                  </option>
                ))}
              </RHFSelect>
            </Box>
            <RHFTextField name="Street" label="Số nhà đường / đường" />

            <RHFCheckbox name="IsDefault" label="Đặt làm địa chỉ mặc định." sx={{ mt: 3 }} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
           Lưu địa chỉ này
          </LoadingButton>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Thoát
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
