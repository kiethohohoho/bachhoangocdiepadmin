// @mui
import {
  Box,
  Card,
  Divider,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { updateStatus } from 'src/api/ortherEcom';
import { PATH_DASHBOARD } from 'src/routes/paths';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
import { fDate } from '../../../../utils/formatTime';
// _mock_
import { IInvoiceDetaill } from '../../../../@types/invoice';
// components
import Image from '../../../../components/image';
import Label from '../../../../components/label';
import Scrollbar from '../../../../components/scrollbar';
//
import InvoiceToolbar from './InvoiceToolbar';

// ----------------------------------------------------------------------

const StyledRowResult = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  invoice: IInvoiceDetaill;
};

const STATUS_OPTIONS = ['Đang chờ duyệt', 'Duyệt', 'Đang giao hàng', 'Hoàn thành', 'Hủy'];

export default function InvoiceDetails({ invoice }: Props) {
  const { order, carts } = invoice;
  const {
    push,
    query: { id },
  } = useRouter();
  const [edit, setEdit] = useState<boolean>(false);
  const handleEdit = () => {
    setEdit(!edit);
  };
  const { enqueueSnackbar } = useSnackbar();
  if (!invoice) {
    return null;
  }

  const numberStatus = (value: string) => {
    switch (value) {
      case 'Đang chờ duyệt':
        return 1;
      case 'Duyệt':
        return 2;
      case 'Đang giao hàng':
        return 3;
      case 'Hoàn thành':
        return 4;
      case 'Hủy':
        return 5;
      default:
        return 1;
    }
  };

  const handleChange = (value: string) => {
    const data = {
      statuscode: numberStatus(value),
    };
    updateStatus(id, data).then((res) => {
      if (res.data.success) {
        enqueueSnackbar(res.data.message);
        push(PATH_DASHBOARD.invoice.list);
      } else {
        setEdit(false);
      }
    });
  };
  return (
    <>
      <InvoiceToolbar invoice={invoice} edit={edit} handleEdit={handleEdit} />

      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Image disabledEffect alt="logo" src="/logo/Group_5.svg" sx={{ maxWidth: 120 }} />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            {edit ? (
              <Box sx={{ textAlign: { sm: 'right' } }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={order?.Status}
                  label="Trạng thái"
                  onChange={(e) => {
                    handleChange(e.target.value);
                  }}
                >
                  {STATUS_OPTIONS.map((e: any) => (
                    <MenuItem value={e}>{e}</MenuItem>
                  ))}
                </Select>
              </Box>
            ) : (
              <Box sx={{ textAlign: { sm: 'right' } }}>
                <Label
                  variant="soft"
                  color={
                    (order?.Status === 'Hoàn thành' && 'success') ||
                    (order?.Status === 'Đang chờ duyệt' && 'warning') ||
                    (order?.Status === 'Đã duyệt' && 'info') ||
                    (order?.Status === 'Hủy' && 'error') ||
                    'default'
                  }
                  sx={{ textTransform: 'uppercase', mb: 1 }}
                >
                  {order?.Status}
                </Label>

                <Typography variant="h6">{order.InvoiceNumber}</Typography>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Invoice from
            </Typography>

            <Typography variant="body2">Bách hóa Ngọc Diệp</Typography>

            <Typography variant="body2">30/04 phường 5, Thị xã Cai Lậy, tỉnh Tiền Giang</Typography>

            <Typography variant="body2">Số điện thoại: 0397516328</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Invoice to
            </Typography>

            <Typography variant="body2">{order?.ReceiverName}</Typography>

            <Typography variant="body2">{order?.FullAddress}</Typography>

            <Typography variant="body2">Số điện thoại: {order?.ReceiverPhoneNumber}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Ngày đặt hàng
            </Typography>

            <Typography variant="body2">{fDate(order?.createdAt)}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Ngày hoàn thành
            </Typography>

            <Typography variant="body2">
              {order?.DeliveryDate ? order?.DeliveryDate : 'Chưa hoàn thành'}
            </Typography>
          </Grid>
        </Grid>

        <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 960 }}>
              <TableHead
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' },
                }}
              >
                <TableRow>
                  <TableCell width={40}>#</TableCell>

                  <TableCell align="left">Tên sản phẩm</TableCell>

                  <TableCell align="center">Số lượng</TableCell>

                  <TableCell align="right">Đơn giá</TableCell>

                  <TableCell align="right">Tổng tiền</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {carts?.map((row: any, index: number) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>

                    <TableCell align="left">
                      <Box sx={{ maxWidth: 560 }}>
                        <Image
                          disabledEffect
                          visibleByDefault
                          alt={row.ProductName}
                          src={row.ProductImageURL}
                          sx={{ borderRadius: 1.5, width: 48, height: 48 }}
                        />
                        <Typography variant="subtitle2">{row.ProductName}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="center">{row.BuyingQuantity}</TableCell>

                    <TableCell align="right">{fCurrency(row.ProductPrice)}</TableCell>

                    <TableCell align="right">{fCurrency(row.Amount)}</TableCell>
                  </TableRow>
                ))}

                <StyledRowResult>
                  <TableCell colSpan={3} />

                  <TableCell align="right" sx={{ typography: 'body1' }}>
                    <Box sx={{ mt: 2 }} />
                    Phương thức thanh toán
                  </TableCell>

                  <TableCell align="right" width={120} sx={{ typography: 'body1' }}>
                    <Box sx={{ mt: 2 }} />
                    {order.PaidType === 'transfer' ? 'Chuyển khoản' : 'Tiền mặt'}
                  </TableCell>
                </StyledRowResult>

                <StyledRowResult>
                  <TableCell colSpan={3} />

                  <TableCell align="right" sx={{ typography: 'h6' }}>
                    Thành tiền
                  </TableCell>

                  <TableCell align="right" width={140} sx={{ typography: 'h6' }}>
                    {fCurrency(order.SubAmount)}
                  </TableCell>
                </StyledRowResult>
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <Divider sx={{ mt: 5 }} />

        <Grid container>
          <Grid item xs={12} md={9} sx={{ py: 3 }}>
            <Typography variant="subtitle2">CHÚ Ý</Typography>

            <Typography variant="body2">
              Chúng tôi luôn sẳn sàn phục vụ quý khách, mọi thắc mắt hảy gửi về họp thư hổ trợ !
            </Typography>
          </Grid>

          <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
            <Typography variant="subtitle2">Hổ trợ</Typography>

            <Typography variant="body2">tankietle0201@gmail.com</Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
