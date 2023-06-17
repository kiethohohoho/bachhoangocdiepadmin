import sumBy from 'lodash/sumBy';
import { useEffect, useState } from 'react';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import {
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableContainer,
  Tabs,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getOder } from 'src/api/ortherEcom';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
import { fTimestamp } from '../../../utils/formatTime';
// _mock_
// @types
import { IInvoice } from '../../../@types/invoice';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import Scrollbar from '../../../components/scrollbar';
import { useSettingsContext } from '../../../components/settings';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  emptyRows,
  getComparator,
  useTable,
} from '../../../components/table';
// sections
import InvoiceAnalytic from '../../../sections/@dashboard/invoice/InvoiceAnalytic';
import { InvoiceTableRow, InvoiceTableToolbar } from '../../../sections/@dashboard/invoice/list';

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = ['all', 'Tiền mặt', 'Chuyển khoản'];

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Người nhận', align: 'left' },
  { id: 'createDate', label: 'Ngày đặt', align: 'left' },
  { id: 'dueDate', label: 'Số điện thoại', align: 'left' },
  { id: 'price', label: 'Tổng tiền', align: 'center', width: 140 },
  { id: 'sent', label: 'Thanh toán', align: 'center', width: 140 },
  { id: 'status', label: 'Trạng thái', align: 'center' },
  { id: '' },
];

// ----------------------------------------------------------------------

InvoiceListPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function InvoiceListPage() {
  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  const { push } = useRouter();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState<IInvoice[]>([]);

  const [filterName, setFilterName] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterService, setFilterService] = useState('all');

  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterService,
    filterStatus,
    filterStartDate,
    filterEndDate,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 56 : 76;

  const isFiltered =
    filterStatus !== 'all' ||
    filterName !== '' ||
    filterService !== 'all' ||
    (!!filterStartDate && !!filterEndDate);

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterService) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  useEffect(() => {
    getOder()
      .then((res) => {
        if (res?.data?.success) {
          setTableData(res?.data?.Orders?.Data);
        } else {
          console.log(res?.data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const getLengthByStatus = (status: string) =>
    tableData.filter((item) => item.Status === status).length;

  const getTotalPriceByStatus = (status: string) => {
    // sumBy(
    //   tableData.filter((item) => item.Status === status),
    //   'TotalAmount'
    // );
    let total: number = 0;
    tableData
      .filter((item) => item.Status === status)
      .map((res) => {
        total += Number(res.TotalAmount);
        return total
      });
    return total;
  };

  const getPercentByStatus = (status: string) =>
    (getLengthByStatus(status) / tableData.length) * 100;

  const TABS = [
    { value: 'all', label: 'Tất cả', color: 'info', count: tableData.length },
    {
      value: 'Đang chờ duyệt',
      label: 'Đang chờ duyệt',
      color: 'warning',
      count: getLengthByStatus('Đang chờ duyệt'),
    },
    {
      value: 'Đã duyệt',
      label: 'Đã duyệt',
      color: 'default',
      count: getLengthByStatus('Đã duyệt'),
    },
    {
      value: 'Đang giao hàng',
      label: 'Đang giao hàng',
      color: 'default',
      count: getLengthByStatus('Đang giao hàng'),
    },
    {
      value: 'Hoàn thành',
      label: 'Hoàn thành',
      color: 'success',
      count: getLengthByStatus('Hoàn thành'),
    },

    { value: 'Hủy', label: 'Hủy', color: 'error', count: getLengthByStatus('Hủy') },
  ] as const;

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterStatus = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterService = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterService(event.target.value);
  };

  const handleDeleteRow = (id: string) => {
    const deleteRow = tableData.filter((row) => row.Id !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selectedRows: string[]) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.Id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (id: string) => {
    push(PATH_DASHBOARD.invoice.view(id));
  };

  const handleViewRow = (id: string) => {
    push(PATH_DASHBOARD.invoice.view(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus('all');
    setFilterService('all');
    setFilterEndDate(null);
    setFilterStartDate(null);
  };

  return (
    <>
      <Head>
        <title>Đơn hàng | Bách hóa Ngọc Diệp</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Danh sách đơn hàng"
          links={[
            {
              name: 'Trang chủ',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Đơn hàng',
              href: PATH_DASHBOARD.invoice.root,
            },
            {
              name: 'Danh sách',
            },
          ]}
        />

        <Card sx={{ mb: 5 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
              spacing={2}
            >
              <InvoiceAnalytic
                title="Tổng cộng"
                total={tableData.length}
                percent={100}
                price={sumBy(tableData, 'totalPrice')}
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />

              <InvoiceAnalytic
                title="Đang chờ duyệt"
                total={getLengthByStatus('Đang chờ duyệt')}
                percent={getPercentByStatus('Đang chờ duyệt')}
                price={getTotalPriceByStatus('Đang chờ duyệt')}
                icon="eva:clock-fill"
                color={theme.palette.warning.main}
              />

              <InvoiceAnalytic
                title="Đã duyệt"
                total={getLengthByStatus('Đã duyệt')}
                percent={getPercentByStatus('Đã duyệt')}
                price={getTotalPriceByStatus('Đã duyệt')}
                icon="eva:file-fill"
                color={theme.palette.text.secondary}
              />

              <InvoiceAnalytic
                title="Đang giao hàng"
                total={getLengthByStatus('Đang giao hàng')}
                percent={getPercentByStatus('Đang giao hàng')}
                price={getTotalPriceByStatus('Đang giao hàng')}
                icon="eva:file-fill"
                color={theme.palette.info.dark}
              />
              <InvoiceAnalytic
                title="Hoàn thành"
                total={getLengthByStatus('Hoàn thành')}
                percent={getPercentByStatus('Hoàn thành')}
                price={getTotalPriceByStatus('Hoàn thành')}
                icon="eva:checkmark-circle-2-fill"
                color={theme.palette.success.main}
              />
              <InvoiceAnalytic
                title="Hủy"
                total={getLengthByStatus('Hủy')}
                percent={getPercentByStatus('Hủy')}
                price={getTotalPriceByStatus('Hủy')}
                icon="eva:bell-fill"
                color={theme.palette.error.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            value={filterStatus}
            onChange={handleFilterStatus}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                icon={
                  <Label color={tab.color} sx={{ mr: 1 }}>
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <Divider />

          <InvoiceTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterService={filterService}
            filterEndDate={filterEndDate}
            onFilterName={handleFilterName}
            optionsService={SERVICE_OPTIONS}
            onResetFilter={handleResetFilter}
            filterStartDate={filterStartDate}
            onFilterService={handleFilterService}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.Id)
                )
              }
              action={
                <Stack direction="row">
                  <Tooltip title="Sent">
                    <IconButton color="primary">
                      <Iconify icon="ic:round-send" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Print">
                    <IconButton color="primary">
                      <Iconify icon="eva:printer-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={handleOpenConfirm}>
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.Id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <InvoiceTableRow
                        key={row.Id}
                        row={row}
                        selected={selected.includes(row.Id)}
                        onSelectRow={() => onSelectRow(row.Id)}
                        onViewRow={() => handleViewRow(row.Id)}
                        onEditRow={() => handleEditRow(row.Id)}
                        onDeleteRow={() => handleDeleteRow(row.Id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Bạn có chắc chắn muốn xóa <strong> {selected.length} </strong> đơn hàng?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Xóa
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterService,
  filterStartDate,
  filterEndDate,
}: {
  inputData: IInvoice[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterService: string;
  filterStartDate: Date | null;
  filterEndDate: Date | null;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (invoice) =>
        // invoice.invoiceNumber.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        invoice.ReceiverName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((invoice) => invoice.Status === filterStatus);
  }

  if (filterService !== 'all') {
    const paidType = filterService === 'Tiền mặt' ? 'cash' : 'transfer';
    inputData = inputData.filter((invoice) => invoice.PaidType === paidType);
  }

  if (filterStartDate && filterEndDate) {
    inputData = inputData.filter(
      (invoice) =>
        fTimestamp(new Date(invoice.createdAt).toLocaleDateString()) >=
          fTimestamp(filterStartDate) &&
        fTimestamp(new Date(invoice.createdAt).toLocaleDateString()) <= fTimestamp(filterEndDate)
    );
  }

  return inputData;
}
