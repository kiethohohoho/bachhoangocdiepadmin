// @mui
import {
  Box,
  Card,
  CardHeader,
  CardProps,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material';
import Link from 'next/link';
import { IInvoice } from 'src/@types/invoice';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { fCurrency } from 'src/utils/formatNumber';
// utils
// components
import Label from '../../../../components/label';
import Scrollbar from '../../../../components/scrollbar';
import { TableHeadCustom } from '../../../../components/table';



// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableData: IInvoice[];
  tableLabels: any;
}

export default function EcommerceBestSalesman({
  title,
  subheader,
  tableData,
  tableLabels,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 720 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row) => (
                <EcommerceBestSalesmanRow key={row.Id} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

// ----------------------------------------------------------------------

type EcommerceBestSalesmanRowProps = {
  row: IInvoice;
};

function EcommerceBestSalesmanRow({ row }: EcommerceBestSalesmanRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Stack direction="row" alignItems="left">
          {/* <Avatar alt={row.ReceiverName} src={row.} /> */}
          <Box>
            <Typography variant="subtitle2"> {row.ReceiverName} </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <Link href={PATH_DASHBOARD.invoice.view(row.Id)}> {row.InvoiceNumber}</Link>
            </Typography>
          </Box>
        </Stack>
      </TableCell>

      <TableCell>{row.ReceiverPhoneNumber}</TableCell>

      <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>

      <TableCell>{fCurrency(row.TotalAmount)}</TableCell>

      <TableCell align="center">
        <Label variant="soft" color="warning">
          {row.Status}
        </Label>
      </TableCell>
    </TableRow>
  );
}
