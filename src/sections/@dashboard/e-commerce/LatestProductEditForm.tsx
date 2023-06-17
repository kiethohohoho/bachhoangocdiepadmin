import { useCallback, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
// next
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography } from '@mui/material';
// routes
// @types

import { useSnackbar } from 'notistack';
import { newBanner, upLoadImage } from 'src/api/ortherEcom';
import FormProvider, { RHFTextField, RHFUpload } from '../../../components/hook-form';
import { IBanner } from '../../../@types/product';
// components
// ----------------------------------------------------------------------

type Props = {
  isEdit?: boolean;
  currentData?: IBanner;
  handleClose: any;
  type:string
};

export default function LatestProductEditForm({ isEdit, currentData, handleClose, type }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    Title: Yup.string().required('Nhập tên'),
  });

  const defaultValues = useMemo<Partial<IBanner>>(
    () => ({
      Title: currentData?.Title || '',
      Description: currentData?.Description || '',
      RedirectUrl: currentData?.RedirectUrl || '',
      Images: [],
      Type: type,
    }),
    [currentData?.Description, currentData?.RedirectUrl, currentData?.Title, type]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;



  useEffect(() => {
    if (isEdit && currentData) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentData]);

  const onSubmit = (data: Partial<IBanner>) => {
    try {
      newBanner(data).then((res) => {
        if (res?.data?.success === true) {
          enqueueSnackbar(!isEdit ? 'Thành công!' : 'Update success!');
          handleClose();
        } else {
          enqueueSnackbar('Không thành công');
        }
      });
      // reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    upLoadImage(acceptedFiles).then((res) => {
      if (res.data.success === true) {
        setValue('Images', res?.data?.images);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveFile = (inputFile: File | string) => {
    const files = getValues('Images') || [];
    const filtered = files && files?.filter((file: any) => file !== inputFile);
    setValue('Images', filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue('Images', []);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid item xs={12} md={8} sx={{ justifyContent: 'center' }}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <RHFTextField name="Title" label="Tên" />
            <RHFTextField name="Redirecturl" label="Link mô tả" />
            <RHFTextField name="Description" label="Mô tả" />
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Hình ảnh
              </Typography>
              <RHFUpload
                multiple
                thumbnail
                name="Images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.log('ON UPLOAD')}
              />
            </Stack>
          </Stack>
        </Card>
        <LoadingButton
          sx={{ mt: 3 }}
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!isEdit ? 'Tạo ngay' : 'Lưu thay đổi'}
        </LoadingButton>
      </Grid>
    </FormProvider>
  );
}
