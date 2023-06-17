/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
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

// components
import { useSnackbar } from 'notistack';
import { getCategoryById, getCategoryGroup, newBrand, updateBrand } from 'src/api/ortherEcom';
import FormProvider, { RHFEditor, RHFSelect, RHFTextField } from '../../../components/hook-form';
import { IBrand, ICategoy } from '../../../@types/product';
// ----------------------------------------------------------------------

type Props = {
  isEdit?: boolean;
  currentData?: IBrand;
  handleClose: any;
  handleReload: ()=>void
};

export default function BrandEditForm({ isEdit, currentData, handleClose, handleReload }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [categoryGroups, setCategoryGroups] = useState<IBrand[]>([]);
  const [categorys, setCategorys] = useState<IBrand[]>([]);

  useEffect(() => {
    getCategoryGroup().then((res) => {
      if (res?.data?.success === true) {
        setCategoryGroups(res?.data?.CategoryGroups?.Data);
      } else {
        enqueueSnackbar('Không thành công');
      }
    });

  
  }, []);

  const NewProductSchema = Yup.object().shape({
    Name: Yup.string().required('Nhập tên nhóm danh mục'),
  });

  console.log('currentData: ', currentData);

  const defaultValues = useMemo<Partial<IBrand>>(
    () => ({
      Name: currentData?.Name || '',
      CategoryGroupId: currentData?.CategoryGroupId || '',
      CategoryId: currentData?.CategoryId || '',
      Description: currentData?.Description || '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    getValues,
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
 
  }, [isEdit]);

  const onSubmit = (data: Partial<ICategoy>) => {
    try {
      if (isEdit) {
        updateBrand(data, currentData?.Id).then((res) => {
          if (res?.data?.success === true) {
            enqueueSnackbar('Cập nhật thành công!');
            handleReload()
            handleClose();
          } else {
            enqueueSnackbar('Không thành công');
          }
        });
      } else {
        newBrand(data).then((res) => {
          if (res?.data?.success === true) {
            enqueueSnackbar('Thành công!');
            handleReload()
            handleClose();
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
            <RHFTextField name="Name" label="Tên thương hiệu" />
            <RHFSelect
              sx={{ marginBottom: 2 }}
              native
              name="CategoryGroupId"
              label="Thuộc nhóm danh mục"
              onChange={(e) => {
                setValue('CategoryGroupId', e.target.value);
                getCategoryById(e.target.value).then((res) => {
                  if (res?.data?.success === true) {
                    setCategorys(res?.data?.category);
                  } else {
                    enqueueSnackbar('Không thành công');
                  }
                });
              }}
            >
              <option value="" />
              {categoryGroups?.map((categoryGroup: any) => (
                <option key={categoryGroup.Id} value={categoryGroup.Id}>
                  {categoryGroup.Name}
                </option>
              ))}
            </RHFSelect>

            <RHFSelect sx={{ marginBottom: 2 }} native name="CategoryId" label="Thuộc danh mục">
              <option value="" />
              {categorys?.map((category: any) => (
                <option key={category.Id} value={category.Id}>
                  {category.Name}
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
