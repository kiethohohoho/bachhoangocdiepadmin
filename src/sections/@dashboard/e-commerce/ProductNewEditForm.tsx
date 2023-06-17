import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
// next
import { useRouter } from 'next/router';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, InputAdornment, Stack, Typography } from '@mui/material';
// routes
import {
  getBranByCategory,
  getCategoryById,
  getCategoryGroup,
  getImages,
  upLoadImage,
} from 'src/api/ortherEcom';
import { addProduct, updateProduct } from 'src/redux/slices/product';
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { ICategoy, ICategoyGroup, IProduct } from '../../../@types/product';
// components
import FormProvider, {
  RHFEditor,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUpload
} from '../../../components/hook-form';
import { useSnackbar } from '../../../components/snackbar';
import { CustomFile } from '../../../components/upload';


// ----------------------------------------------------------------------

const CATEGORY_OPTION = [
  { group: 'Clothing', classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather'] },
  { group: 'Tailored', classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats'] },
  { group: 'Accessories', classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks'] },
];

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IProduct, 'images'> {
  taxes: boolean;
  inStock: boolean;
  images: (CustomFile | string)[];
}

type Props = {
  isEdit?: boolean;
  currentProduct?: IProduct;
};

export default function ProductNewEditForm({ isEdit, currentProduct }: Props) {
  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [brans, setBrans] = useState<any>();
  const [categoryGroups, setCategoryGroups] = useState<ICategoyGroup[]>([]);
  const [categorys, setCategorys] = useState<ICategoy[]>([]);
  const [images, setimages] = useState<any>([]);

  useEffect(() => {
    getCategoryGroup().then((res) => {
      if (res?.data?.success === true) {
        setCategoryGroups(res?.data?.CategoryGroups?.Data);
      } else {
        enqueueSnackbar('Không thành công');
      }
    });
    if (currentProduct !== undefined) {
      getCategoryById(currentProduct.CategoryGroupId).then((res) => {
        if (res?.data?.success === true) {
          setCategorys(res?.data?.category);
        } else {
          enqueueSnackbar('Không thành công');
        }
      });
      getBranByCategory(currentProduct.CategoryId).then((res) => {
        if (res?.data?.success === true) {
          setBrans(res?.data?.brands);
        } else {
          enqueueSnackbar('Không thành công');
        }
      });
      getImages(currentProduct.Id).then((res) => {
        if (res?.data?.success === true) {
          setimages(res?.data?.image);
        } else {
          enqueueSnackbar('Không thành công');
        }
      });
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const NewProductSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    Price: Yup.number().moreThan(0, 'Giá phải lớn hơn 0đ'),
  });

  const defaultValues = useMemo<Partial<IProduct>>(
    () => ({
      BrandId: currentProduct?.BrandId || '',
      CategoryId: currentProduct?.CategoryId || '',
      CategoryGroupId: currentProduct?.CategoryGroupId || '',
      Name: currentProduct?.Name || '',
      Description: currentProduct?.Description || '',
      Price: currentProduct?.Price || 0,
      Quantity: currentProduct?.Quantity || 0,
      IsBestSeller: currentProduct?.IsBestSeller || false,
      Images: images || [],
    }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
    [images]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, images]);

  const onSubmit = (data: Partial<IProduct>) => {
    try {
      if (isEdit) {
        updateProduct(data, currentProduct?.Id).then((res) => {
          if (res?.data?.success === true) {
            reset();
            enqueueSnackbar('Update success!');
            push(PATH_DASHBOARD.eCommerce.list);
          }
        });
      } else {
        addProduct(data).then((res) => {
          if (res?.data?.success === true) {
            reset();
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
            push(PATH_DASHBOARD.eCommerce.list);
          }
        });
      }
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();
      // enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const files = getValues('Images') || [];

    upLoadImage(acceptedFiles).then((res) => {
      if (res?.data?.success === true) {
        const i:any = res?.data?.images
        setValue('Images', [...files, ...i]);
      }
    });
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveFile = (inputFile: any) => {
    const files = getValues('Images') || [];

    const filtered = files && files.filter((file: any) => file.Id !== inputFile.Id);

    setValue('Images', filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue('Images', []);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="Name" label="Tên sản phẩm" />

              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Mô tả
                </Typography>

                <RHFEditor simple name="Description" />
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Hình ảnh minh họa
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
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <RHFSwitch name="IsBestSeller" label="Best seller" />
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
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
                <RHFSelect
                  onChange={(e) => {
                    setValue('CategoryId', e.target.value);
                    getBranByCategory(e.target.value).then((res) => {
                      if (res?.data?.success === true) {
                        setBrans(res?.data?.brands);
                      } else {
                        enqueueSnackbar('Không thành công');
                      }
                    });
                  }}
                  sx={{ marginBottom: 2 }}
                  native
                  name="CategoryId"
                  label="Thuộc danh mục"
                >
                  <option value="" />
                  {categorys?.map((category: any) => (
                    <option key={category.Id} value={category.Id}>
                      {category.Name}
                    </option>
                  ))}
                </RHFSelect>

                <RHFSelect native name="BrandId" label="Thương hiệu">
                  <option value="" />
                  {brans?.map((bran: any) => (
                    <option key={bran.Id} value={bran.Id}>
                      {bran.Name}
                    </option>
                  ))}
                </RHFSelect>
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFTextField
                  name="Quantity"
                  label="số lượng"
                  placeholder="0"
                  onChange={(event) => setValue('Quantity', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: 'number',
                  }}
                />

                <RHFTextField
                  name="Price"
                  label="Giá bán"
                  placeholder="0.00"
                  onChange={(event) =>
                    setValue('Price', Number(event.target.value), { shouldValidate: true })
                  }
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          đ
                        </Box>
                      </InputAdornment>
                    ),
                    type: 'number',
                  }}
                />
                <RHFTextField
                  name="Pricee"
                  label="Giảm giá"
                  placeholder="0.00"
                  onChange={(event) =>
                    setValue('Price', Number(event.target.value), { shouldValidate: true })
                  }
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          đ
                        </Box>
                      </InputAdornment>
                    ),
                    type: 'number',
                  }}
                />
              </Stack>
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Thêm sản phẩm' : 'Lưu thay đổi'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
