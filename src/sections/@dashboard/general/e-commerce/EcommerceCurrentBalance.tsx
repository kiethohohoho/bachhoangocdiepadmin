// @mui
import { Button, Card, Typography, Stack, CardProps } from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  sentAmount: number;
  currentBalance: number;
}

export default function EcommerceCurrentBalance({
  title,
  sentAmount,
  currentBalance,
  sx,
  ...other
}: Props) {
  const totalAmount = currentBalance - sentAmount;

  return (
    <Card sx={{ p: 3, ...sx }} {...other}>
      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>

      <Stack spacing={2}>
        <Typography variant="h3">{fCurrency(totalAmount)}</Typography>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Số dư hiện tại của bạn
          </Typography>
          <Typography variant="body2">{fCurrency(currentBalance)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Số tiền đã gửi
          </Typography>
          <Typography variant="body2">- {fCurrency(sentAmount)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tổng cộng
          </Typography>
          <Typography variant="subtitle1">{fCurrency(totalAmount)}</Typography>
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <Button fullWidth variant="contained" color="warning">
            Chuyển khoản
          </Button>

          <Button fullWidth variant="contained">
            Nhận được
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
