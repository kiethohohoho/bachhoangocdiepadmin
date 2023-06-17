import { useCallback } from 'react';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { IUserAccountGeneral } from 'src/@types/user';
import { upLoadImage, updateProfile } from 'src/api/ortherEcom';
import { fDate } from 'src/utils/formatTime';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar
} from '../../../../components/hook-form';
import { useSnackbar } from '../../../../components/snackbar';
import { fData } from '../../../../utils/formatNumber';
// ----------------------------------------------------------------------

export default function AccountGeneral({user}:any) {
  const { enqueueSnackbar } = useSnackbar();
  


  const UpdateUserSchema = Yup.object().shape({
    FirstName: Yup.string().required('Name is required'),
    LastName: Yup.string().required('Avatar is required'),
    PhoneNumber: Yup.string().required('Phone number is required'),
  });

  const defaultValues = {
    FirstName: user?.FirstName || '',
    LastName: user?.FullName || '',
    DateOfBirth: fDate(user?.DateOfBirth) || '',
    PhoneNumber: user?.PhoneNumber || '',
    Avatar: user?.Avatar || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: Partial<IUserAccountGeneral>) => {
    try {
      updateProfile(data).then(() => {
        enqueueSnackbar('Update success!');
      });

      console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      upLoadImage(acceptedFiles).then((res) => {
        if (res.data.success === true) {
          setValue('Avatar', res?.data?.images[0]?.OriginalImageUrl, { shouldValidate: true });
        }
      });
      // const file = acceptedFiles[0];
      // const newFile = Object.assign(file, {
      //   preview: URL.createObjectURL(file),
      // });

      // if (file) {
      //   //setValue('photoURL', newFile, { shouldValidate: true });
      // }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="Avatar"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            <RHFSwitch
              name="isPublic"
              labelPlacement="start"
              label="Public Profile"
              sx={{ mt: 5 }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="FirstName" label="Họ" />

              <RHFTextField name="LastName" label="Tên" />

              <RHFTextField name="PhoneNumber" label="Số điện thoại" />

              <RHFTextField name="DateOfBirth" label="Ngày sinh" />

              {/* <RHFTextField name="address" label="Address" /> */}

              {/* <RHFSelect native name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((country) => (
                  <option key={country.code} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="state" label="State/Region" />

              <RHFTextField name="city" label="City" />

              <RHFTextField name="zipCode" label="Zip/Code" /> */}
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="about" multiline rows={4} label="About" />

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Lưu hồ sơ
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
