import { useEffect, useMemo } from 'react';
import * as Yup from 'yup';
// next
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack } from '@mui/material';
// components
import { useSnackbar } from 'notistack';
import { newCategoryGroup, updateCategoryGroup } from 'src/api/ortherEcom';
// routes
// @types
import { ICategoyGroup } from '../../../@types/product';

import FormProvider, { RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  isEdit?: boolean;
  currentData?: ICategoyGroup;
  handleClose: any;
  handleReload: () => void;
};

export default function CategoryGroupEditForm({
  isEdit,
  currentData,
  handleClose,
  handleReload,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    Name: Yup.string().required('Nhập tên nhóm danh mục'),
  });

  const defaultValues = useMemo<Partial<ICategoyGroup>>(
    () => ({
      Name: currentData?.Name || '',
      Description: currentData?.Description || '',
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
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
  }, [isEdit]);

  const onSubmit = (data: Partial<ICategoyGroup>) => {
    try {
      if (isEdit) {
        updateCategoryGroup(data, currentData?.Id).then((res) => {
          if (res?.data?.success === true) {
            enqueueSnackbar('Cập nhật thành công!');
            reset();
            handleReload();
            handleClose();
          } else {
            enqueueSnackbar('Không thành công');
          }
        });
      } else {
        newCategoryGroup(data).then((res) => {
          if (res?.data?.success === true) {
            enqueueSnackbar('Thành công!');
            reset();
            handleReload();
            handleClose();
          } else {
            enqueueSnackbar('Không thành công');
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid item xs={12} md={8} sx={{ justifyContent: 'center' }}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <RHFTextField name="Name" label="Tên nhóm danh mục" />
            <RHFTextField name="Description" label="Mô tả" />
          </Stack>
        </Card>
        <LoadingButton
          sx={{ mt: 3 }}
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!isEdit ? 'Tạo nhóm danh mục' : 'Lưu thay đổi'}
        </LoadingButton>
      </Grid>
    </FormProvider>
  );
}
