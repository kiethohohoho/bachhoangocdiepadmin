import { useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { PATH_AUTH } from 'src/routes/paths';
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';


// ----------------------------------------------------------------------

type FormValuesProps = {
  afterSubmit?: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber:string
};

export default function AuthRegisterForm() {
  const { register } = useAuthContext();
  const { replace } = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstname: Yup.string().required('Vui lòng nhập họ'),
    lastname: Yup.string().required('Vui lòng nhập tên'),
    password: Yup.string().required('Vui lòng nhập mật khẩu'),
    email: Yup.string().required('Vui lòng nhập số điện thoại'),
  });

  const defaultValues = {
    password: '',
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: ''
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (register) {
        const res: any = await register(data.password, data.firstname, data.lastname, data.email, data.phonenumber);
        if (res?.access?.token) {
          replace(PATH_AUTH.verify);
        }
      }
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message || error,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstname" label="Họ tên đệm" />
          <RHFTextField name="lastname" label="Tên" />
        </Stack>
        <RHFTextField name="email" label="Email" />
        <RHFTextField name="phonenumber" label="Số điện thoại" />
        <RHFTextField
          name="password"
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting || isSubmitSuccessful}
          sx={{
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            '&:hover': {
              bgcolor: 'text.primary',
              color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            },
          }}
        >
          Tạo tài khoản
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
