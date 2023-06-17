import { useState, useMemo, useEffect } from 'react';
import * as Yup from 'yup';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// @types
import { IInvoice, IInvoiceAddress, IInvoiceDetaill } from '../../../../@types/invoice';
// mock
import { _invoiceAddressFrom } from '../../../../_mock/arrays';
// components
import FormProvider from '../../../../components/hook-form';
//
import InvoiceNewEditDetails from './InvoiceNewEditDetails';
import InvoiceNewEditAddress from './InvoiceNewEditAddress';
import InvoiceNewEditStatusDate from './InvoiceNewEditStatusDate';

// ----------------------------------------------------------------------

type IFormValuesProps = Omit<IInvoice, 'createDate' | 'dueDate' | 'invoiceFrom' | 'invoiceTo'>;

interface FormValuesProps extends IFormValuesProps {
  createDate: Date | null;
  dueDate: Date | null;
  invoiceFrom: IInvoiceAddress | null;
  invoiceTo: IInvoiceAddress | null;
}

type Props = {
  isEdit?: boolean;
  currentInvoice?: IInvoiceDetaill;
};

export default function InvoiceNewEditForm({ isEdit, currentInvoice }: Props) {
  const { push } = useRouter();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const NewUserSchema = Yup.object().shape({
    createDate: Yup.string().nullable().required('Create date is required'),
    dueDate: Yup.string().nullable().required('Due date is required'),
    invoiceTo: Yup.mixed().nullable().required('Invoice to is required'),
  });

  const defaultValues = useMemo(
    () => ({
      invoiceNumber: currentInvoice?.order.InvoiceNumber || '17099',
      createDate: currentInvoice?.order.createdAt || new Date(),
      dueDate: currentInvoice?.order.DeliveryDate || null,
      taxes: currentInvoice?.order.VAT || 0,
      status: currentInvoice?.order.Status || 'Hủy',
      discount:   0,
      invoiceFrom:  _invoiceAddressFrom[0],
      invoiceTo:  null,
      items: currentInvoice?.carts || [
        { title: '', description: '', service: '', quantity: 1, price: 0, total: 0 },
      ],
      totalPrice: currentInvoice?.order.SubAmount || 0,
    }),
    [currentInvoice]
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentInvoice) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentInvoice]);

  const handleSaveAsDraft = async (data: FormValuesProps) => {
    setLoadingSave(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      setLoadingSave(false);
      push(PATH_DASHBOARD.invoice.list);
      console.log('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      setLoadingSave(false);
    }
  };

  const handleCreateAndSend = async (data: FormValuesProps) => {
    setLoadingSend(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      setLoadingSend(false);
      push(PATH_DASHBOARD.invoice.list);
      console.log('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      setLoadingSend(false);
    }
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <InvoiceNewEditAddress />

        <InvoiceNewEditStatusDate />

        <InvoiceNewEditDetails />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          color="inherit"
          size="large"
          variant="contained"
          loading={loadingSave && isSubmitting}
          onClick={handleSubmit(handleSaveAsDraft)}
        >
          Save as Draft
        </LoadingButton>

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend && isSubmitting}
          onClick={handleSubmit(handleCreateAndSend)}
        >
          {isEdit ? 'Update' : 'Create'} & Send
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
