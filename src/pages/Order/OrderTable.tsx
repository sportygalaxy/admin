import { flexRender, Row, HeaderGroup } from "@tanstack/react-table";
import { Button, Popover, Tooltip, Typography } from "@mui/material";
import { DotsVertical, ImageUser, Share01 } from "@untitled-ui/icons-react";
import { useState, useEffect } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import ReusableTable from "@/common/Table/ReuseableTable";
import { Pagination } from "@/common/Table/Pagination";
import Search from "@/common/Table/Search";

import Filter from "@/common/Table/Filter";

import { generatePath, Link, useNavigate } from "react-router-dom";
import { routeEnum } from "@/constants/RouteConstants";
import TableText from "@/common/Table/TableText";
import { ApiOrderStoreSlice } from "@/api/ApiOrderStoreSlice";
import { TABLE_ROW_TYPE } from "@/constants/enums";
import { useQuery } from "@/hooks/useQuery";
import TableSkeletonLoader from "@/common/Table/TableSkeletonLoader";
import TableEmpty from "@/common/Table/TableEmpty";
import { User } from "@/types/user";
import LoadingContent from "@/common/LoadingContent/LoadingContent";
import useExtendedSnackbar from "@/hooks/useExtendedSnackbar";
import TableError from "@/common/Table/TableError";
import { exportToCSV } from "@/helpers/exportToCSV";
import { PAGINATION_DEFAULT } from "@/constants/AppConstants";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import OrderStatusAssignModal from "./OrderStatusAssignModal";
import { useQueryParam } from "@/hooks/useQueryParam";

const OrderTable = () => {
  const query = useQuery();
  const { get } = useQueryParam();
  const { showErrorSnackbar } = useExtendedSnackbar();
  const navigate = useNavigate();

  const handleGotoOrder = (id: string) => {
    const route = generatePath(routeEnum.ORDER_DETAILS, {
      id,
    });
    navigate(route);
  };

  const columns: ColumnDef<any, any>[] = [
    { accessorKey: "orderName", header: "Images" },
    { accessorKey: "orderProductName", header: "Name" },
    { accessorKey: "orderCustomerName", header: "User" },
    { accessorKey: "id", header: "Order ID" },
    { accessorKey: "total", header: "Total Paid" },
    { accessorKey: "orderStatus", header: "Status" },
    { accessorKey: "paymentOption", header: "Payment Option" },
    { accessorKey: "count", header: "Total no of Item in Cart" },
    { accessorKey: "qty", header: "Total qty in Cart" },
    { accessorKey: "createdAt", header: "Created On" },
    { accessorKey: "updatedAt", header: "Last Updated On" },
    { accessorKey: "isDeleted", header: "Order Deleted" },
    { accessorKey: "isOfflineOrder", header: "Order mood" },
    {
      accessorKey: "action",
      header: () => <></>, // Keep the header empty or customize it
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <PopupState variant="popover" popupId="tour-table">
            {(popupState: any) => (
              <>
                <div
                  className="p-2 cursor-pointer"
                  {...bindTrigger(popupState)}
                >
                  <DotsVertical />
                </div>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <div className="rounded-tr-md rounded-tl-md w-[170px]">
                    <Link
                      to={`${generatePath(routeEnum.ORDER_DETAILS, {
                        id: row.original.id,
                      })}`}
                      className="flex items-center justify-start gap-2 px-4 py-3 cursor-pointer hover:bg-slate-50"
                    >
                      <ImageUser width={20} height={20} />
                      <Typography
                        color="grey.700"
                        className="text-xs font-medium capitalize font-inter"
                      >
                        View order
                      </Typography>
                    </Link>

                    <OrderStatusAssignModal
                      id={row.original.id}
                      status={row.original.status}
                      buttonText="Update Order Status"
                    />
                  </div>
                </Popover>
              </>
            )}
          </PopupState>
        </div>
      ),
      // size: 50,
      // maxSize: 50,
      // minSize: 50,
    },
  ];

  // Custom renderHeader function
  const renderHeader = (headerGroup: HeaderGroup<User>) => (
    <>
      {headerGroup.headers.map((header) => (
        <th key={header.id} className="p-6 py-3 font-medium">
          <div
            {...{
              onClick: header.column.getToggleSortingHandler(),
              style: { cursor: "pointer" },
            }}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {header.column.getIsSorted()
              ? header.column.getIsSorted() === "desc"
                ? " ▼"
                : " ▲"
              : null}
          </div>
        </th>
      ))}
    </>
  );

  // Custom renderRow function
  const renderRow = (row: Row<User>) => (
    <tr
      key={row.id}
      className="py-5 border-b-1 border-[#EAECF0] hover:bg-[#F3F4F7] cursor-pointer"
    >
      {row.getVisibleCells().map((cell) => {
        // Ordered Customer Name
        if (cell.column.id === "orderCustomerName") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoOrder(cell.row.original.id)}
              className="p-6 py-4"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.ORDER_CUSTOMER_NAME}
              />
            </td>
          );
        }

        // Ordered Item Count
        if (cell.column.id === "count") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoOrder(cell.row.original.id)}
              className="p-6 py-4"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.ORDERED_ITEM_COUNT}
              />
            </td>
          );
        }

        // Total Ordered Items Count
        if (cell.column.id === "qty") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoOrder(cell.row.original.id)}
              className="p-6 py-4"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.ORDERED_ITEM_QTY_COUNT}
              />
            </td>
          );
        }

        // Created At
        if (cell.column.id === "createdAt") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoOrder(cell.row.original.id)}
              className="p-6 py-4"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.CREATED_AT_DATE}
              />
            </td>
          );
        }

        // Updated At
        if (cell.column.id === "updatedAt") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoOrder(cell.row.original.id)}
              className="p-6 py-4"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.UPDATED_AT_DATE}
              />
            </td>
          );
        }

        // Is deleted
        if (cell.column.id === "isDeleted") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoOrder(cell.row.original.id)}
              className="p-6 py-4"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.CLIENT_ACCOUNT_DELETED}
              />
            </td>
          );
        }

        // Is offline order
        if (cell.column.id === "isOfflineOrder") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoOrder(cell.row.original.id)}
              className="p-6 py-4"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.OFFLINE_ORDER}
              />
            </td>
          );
        }

        // Order name
        if (cell.column.id === "orderName") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoOrder(cell.row.original.id)}
              className="p-6 py-4"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.ORDER_NAME}
              />
            </td>
          );
        }

        // Order product name
        if (cell.column.id === "orderProductName") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoOrder(cell.row.original.id)}
              className="p-6 py-4"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.ORDER_PRODUCT_NAME}
              />
            </td>
          );
        }

        // Order Status
        if (cell.column.id === "orderStatus") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoOrder(cell.row.original.id)}
              className="p-6 py-4"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.ORDER_STATUS}
              />
            </td>
          );
        }

        // Order total
        if (cell.column.id === "total") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoOrder(cell.row.original.id)}
              className="p-6 py-4"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.ORDER_PRICE}
              />
            </td>
          );
        }

        // Default
        return (
          <td
            key={cell.id}
            onClick={() =>
              cell.column.id !== "action" &&
              handleGotoOrder(cell.row.original.id)
            }
            className={`py-4 p-6 ${
              cell.column.id === "action" ? "action-column" : ""
            }`}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );

  const [pageIndex, setPageIndex] = useState(PAGINATION_DEFAULT.page);
  const [pageSize, setPageSize] = useState(PAGINATION_DEFAULT.limit);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const orderStatus = query.get("tab") || "";
  const pageIndexFromUrl = get("page") || pageIndex;

  // State for filters
  const [isDeleted, setIsDeleted] = useState<boolean | undefined>(false);
  const [isRequestDelete, setIsRequestDelete] = useState<boolean | undefined>(
    false
  );

  // Fetch the orders using your actual API
  const {
    data: ordersResponse, // Fetch the response which contains the result and other meta info
    isLoading,
    isError,
    refetch,
    error,
  } = ApiOrderStoreSlice.useGetOrdersQuery({
    pageIndex: Number(pageIndexFromUrl) || pageIndex,
    pageSize,
    sorting,
    globalFilter,
    isDeleted, // Pass isDeleted filter
    isRequestDelete, // Pass isRequestDelete filter
    orderStatus,
  });

  const orders = ordersResponse?.data?.results || [];

  // Transform data based on filter logic
  const filteredOrders = orders.filter((order: any) => {
    const isDeletedMatch = isDeleted
      ? order.accountEnabled === isDeleted
      : true;
    const requestDeleteMatch = isRequestDelete
      ? order.approval === isRequestDelete
      : true;

    if (isDeleted || !isRequestDelete) return order;

    return isDeletedMatch && requestDeleteMatch;
  });

  const totalItems = ordersResponse?.data?.count;
  const pageCount = Math.ceil(totalItems / pageSize);

  const fetchData = (
    pageIndex: number,
    pageSize: number,
    sorting: SortingState,
    globalFilter: string
  ) => {
    setPageIndex(Number(pageIndexFromUrl) || pageIndex);
    setPageSize(pageSize);
    setSorting(sorting);
    setGlobalFilter(globalFilter);
    setIsDeleted(isDeleted);
    setIsRequestDelete(isRequestDelete);
  };

  useEffect(() => {
    fetchData(pageIndex, pageSize, sorting, globalFilter);
  }, [
    pageIndex,
    pageSize,
    sorting,
    globalFilter,
    isDeleted,
    isRequestDelete,
    pageIndexFromUrl,
  ]);

  if (isError) {
    showErrorSnackbar(error?.message || "Error occured");
  }

  const handleExportCSV = () => {
    exportToCSV(filteredOrders, "table_data");
  };

  return (
    <>
      {filteredOrders.length <= 0 ? (
        <div className="table-toolbar mt-4">
          <div className="table-toolbar-search">
            <Search
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </div>

          <div className="table-toolbar-actions">
            <Filter
              isDeleted={isDeleted}
              setIsDeleted={setIsDeleted}
              isRequestDelete={isRequestDelete}
              setIsRequestDelete={setIsRequestDelete}
            />

            <Button
              variant="outlined"
              startIcon={<Share01 width={20} height={20} />}
              className="flex items-center justify-center font-bold capitalize font-inter"
              size="medium"
              onClick={handleExportCSV}
            >
              <Tooltip title="Download CSV">
                <p>Export</p>
              </Tooltip>
            </Button>
          </div>
        </div>
      ) : null}

      <LoadingContent
        loading={isLoading}
        error={isError}
        onReload={refetch}
        loadingContent={<TableSkeletonLoader />}
        errorContent={<TableError onReload={() => refetch()} />}
        emptyContent={<TableEmpty />}
        data={filteredOrders}
      >
        <ReusableTable
          columns={columns}
          data={filteredOrders}
          pageCount={pageCount}
          fetchData={fetchData}
          PaginationComponent={Pagination}
          SearchComponent={Search}
          FilterComponent={
            <Filter
              isDeleted={isDeleted}
              setIsDeleted={setIsDeleted}
              isRequestDelete={isRequestDelete}
              setIsRequestDelete={setIsRequestDelete}
            />
          }
          ExportComponent={
            <Button
              variant="outlined"
              startIcon={<Share01 width={20} height={20} />}
              className="flex items-center justify-center font-bold capitalize font-inter"
              size="medium"
              onClick={handleExportCSV}
            >
              <Tooltip title="Download CSV">
                <p>Export</p>
              </Tooltip>
            </Button>
          }
          renderHeader={renderHeader}
          renderRow={renderRow}
        />
      </LoadingContent>
    </>
  );
};

export default OrderTable;
