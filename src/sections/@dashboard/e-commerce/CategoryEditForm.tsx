import { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
// next
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { getCategoryGroup, newCategory, updateCategory } from 'src/api/ortherEcom';
// routes
// @types
import { ICategoy, ICategoyGroup } from '../../../@types/product';
// components

import FormProvider, { RHFSelect, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

const CATEGORY_OPTION = [
  { group: 'Clothing', classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather'] },
  { group: 'Tailored', classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats'] },
  { group: 'Accessories', classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks'] },
];

type Props = {
  isEdit?: boolean;
  currentData?: ICategoy;
  handleClose: any;
  handleReload: () => void;
};

export default function CategoryEditForm({
  isEdit,
  currentData,
  handleClose,
  handleReload,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [categoryGroups, setCategoryGroups] = useState<ICategoyGroup[]>([]);

  useEffect(() => {
    getCategoryGroup().then((res) => {
      if (res?.data?.success === true) {
        setCategoryGroups(res?.data?.CategoryGroups?.Data);
      } else {
        enqueueSnackbar('Không thành công');
      }
    });
  }, [enqueueSnackbar]);

  const NewProductSchema = Yup.object().shape({
    Name: Yup.string().required('Nhập tên danh mục'),
    CategoryGroupId: Yup.string().required('Nhập tên nhóm danh mục'),
  });

  const defaultValues = useMemo<Partial<ICategoy>>(
    () => ({
      Name: currentData?.Name || '',
      CategoryGroupId: currentData?.CategoryGroupId || '',
      Description: currentData?.Description || '',
    }),

    [currentData]
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

  const values = watch();

  useEffect(() => {
    if (isEdit && currentData) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  const onSubmit = (data: Partial<ICategoy>) => {
    try {
      if (isEdit) {
        updateCategory(data, currentData?.Id).then((res) => {
          if (res?.data?.success === true) {
            enqueueSnackbar('Cập nhật thành công!');
            handleReload();
            handleClose();
            reset();
          } else {
            enqueueSnackbar('Không thành công');
          }
        });
      } else {
        newCategory(data).then((res) => {
          if (res?.data?.success === true) {
            enqueueSnackbar('Thành công!');
            handleReload();
            handleClose();
            reset();
          } else {
            enqueueSnackbar('Không thành công');
          }
        });
      }

      // reset();
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
            <RHFSelect
              sx={{ marginBottom: 2 }}
              native
              name="CategoryGroupId"
              label="Thuộc nhóm danh mục"
            >
              <option value="" />
              {categoryGroups?.map((categoryGroup: any) => (
                <option key={categoryGroup.Id} value={categoryGroup.Id}>
                  {categoryGroup.Name}
                </option>
              ))}
            </RHFSelect>
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
          {!isEdit ? 'Tạo danh mục' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </FormProvider>
  );
}
