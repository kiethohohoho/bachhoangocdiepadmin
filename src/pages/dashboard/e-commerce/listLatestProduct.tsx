import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import {
  Button,
  Card,
  Container,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
// redux
import { Box } from '@mui/system';
import { getBanner } from 'src/api/ortherEcom';
import BannerTableRow from 'src/sections/@dashboard/e-commerce/BannerTableRow';
import EventEditFrom from 'src/sections/@dashboard/e-commerce/EventEditFrom';
import { useDispatch } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { IBanner } from '../../../@types/product';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { useSettingsContext } from '../../../components/settings';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  TableSkeleton,
  emptyRows,
  getComparator,
  useTable,
} from '../../../components/table';
// sections
import { ProductTableToolbar } from '../../../sections/@dashboard/e-commerce/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Name', label: 'Tên sự kiện', align: 'left' },
  { id: 'createdAt', label: 'Ngày tạo', align: 'left' },
  { id: 'link', label: 'Liên kết', align: 'left' },
  { id: 'Description', label: 'Mô tả', align: 'left', width: 180 },
  { id: '' },
];

const STATUS_OPTIONS = [
  { value: 'in_stock', label: 'In stock' },
  { value: 'low_stock', label: 'Low stock' },
  { value: 'out_of_stock', label: 'Out of stock' },
];

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

// ----------------------------------------------------------------------

ListLatestProduct.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function ListLatestProduct() {
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
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const { themeStretch } = useSettingsContext();

  const { push } = useRouter();

  const dispatch = useDispatch();

  const [tableData, setTableData] = useState<IBanner[]>([]);

  const [filterName, setFilterName] = useState<string>('');

  const [filterStatus, setFilterStatus] = useState<string[]>([]);

  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [idRow, setIdRow] = useState<string>('');

  const handleOpen = () => {
    setIsEdit(false);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getBanner('latestProduct')
      .then((res) => {
        if (res?.data?.success === true) {
          setTableData(res?.data?.Banners?.Data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => setIsLoading(false));
  }, []);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 60 : 80;

  const isFiltered = filterName !== '' || !!filterStatus.length;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterStatus = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setPage(0);
    setFilterStatus(typeof value === 'string' ? value.split(',') : value);
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

  const handleEditRow = (id: any) => {
    setIsEdit(true);
    setIdRow(id);
    setOpen(true);
  };

  const handleViewRow = (id: string) => {
    push(PATH_DASHBOARD.eCommerce.view(paramCase(id)));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };

  return (
    <>
      <Head>
        <title> Dòng sản phẩm mới</title>
      </Head>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        sx={{ borderRadius: 5 }}
      >
        <Box sx={{ ...style, borderRadius: 5 }}>
          <Scrollbar>
            <EventEditFrom
              type='latestProduct'
              handleClose={handleClose}
              isEdit={isEdit}
              current={isEdit ? idRow : undefined}
            />
          </Scrollbar>
        </Box>
      </Modal>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Dòng sản phẩm mới"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              onClick={() => handleOpen()}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
             Thêm dòng sản phẩm mới
            </Button>
          }
        />
        <Card>
          <ProductTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            statusOptions={STATUS_OPTIONS}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
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
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <BannerTableRow
                          key={row.Id}
                          row={row}
                          selected={selected.includes(row.Id)}
                          onSelectRow={() => onSelectRow(row.Id)}
                          onDeleteRow={() => handleDeleteRow(row.Id)}
                          onEditRow={() => handleEditRow(row.Id)}
                          onViewRow={() => handleViewRow(row.Id)}
                        />
                      ) : (
                        !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )}

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
            //
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
            Are you sure want to delete <strong> {selected.length} </strong> items?
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
            Delete
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
}: {
  inputData: IBanner[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string[];
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
      (product) => product.Title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  // if (filterStatus.length) {
  //   inputData = inputData.filter((product) => filterStatus.includes(product.Quantity));
  // }

  return inputData;
}
