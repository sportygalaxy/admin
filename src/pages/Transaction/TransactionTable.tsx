import { flexRender, Row, HeaderGroup } from "@tanstack/react-table";
import { Button, Tooltip } from "@mui/material";
import { Share01 } from "@untitled-ui/icons-react";
import { useState, useEffect } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import ReusableTable from "@/common/Table/ReuseableTable";
import { Pagination } from "@/common/Table/Pagination";
import Search from "@/common/Table/Search";

import Filter from "@/common/Table/Filter";

import TableText from "@/common/Table/TableText";
import { ApiTransactionStoreSlice } from "@/api/ApiTransactionStoreSlice";
import { TABLE_ROW_TYPE } from "@/constants/enums";
import { useQuery } from "@/hooks/useQuery";
import TableSkeletonLoader from "@/common/Table/TableSkeletonLoader";
import TableEmpty from "@/common/Table/TableEmpty";
import LoadingContent from "@/common/LoadingContent/LoadingContent";
import useExtendedSnackbar from "@/hooks/useExtendedSnackbar";
import TableError from "@/common/Table/TableError";
import { exportToCSV } from "@/helpers/exportToCSV";
import { PAGINATION_DEFAULT } from "@/constants/AppConstants";
import { useLocation, useNavigate } from "react-router-dom";
import TransactionDetailModal from "./TransactionDetailModal";

const DEFAULT_TRANSACTION_SORTING: SortingState = [
  { id: "createdAt", desc: true },
];

const parsePositiveInteger = (value: string | null, fallback: number) => {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
};

const parseTransactionSorting = (value: string | null): SortingState => {
  if (!value) {
    return DEFAULT_TRANSACTION_SORTING;
  }

  const [id, direction] = value.split(",");

  if (!id) {
    return DEFAULT_TRANSACTION_SORTING;
  }

  return [{ id, desc: direction !== "asc" }];
};

const TransactionTable = () => {
  const query = useQuery();
  const location = useLocation();
  const navigate = useNavigate();
  const { showErrorSnackbar } = useExtendedSnackbar();
  const defaultSorting = parseTransactionSorting(query.get("sort"));
  const defaultPageIndex =
    parsePositiveInteger(query.get("page"), PAGINATION_DEFAULT.page) - 1;
  const defaultPageSize = parsePositiveInteger(
    query.get("limit"),
    PAGINATION_DEFAULT.limit
  );
  const defaultGlobalFilter = query.get("q") || "";
  const defaultIsDeleted = query.get("isDeleted") === "true";
  const defaultIsRequestDelete = query.get("isRequestDelete") === "true";

  const columns: ColumnDef<any, any>[] = [
    { accessorKey: "id", header: "Transaction Id" },
    {
      accessorKey: "customerName",
      header: "Customer",
      enableSorting: false,
    },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "currency", header: "Currency" },
    { accessorKey: "gateway", header: "Gateway", enableSorting: false },
    { accessorKey: "status", header: "Status" },
    {
      accessorKey: "paymentOption",
      header: "Payment Plan",
      enableSorting: false,
    },
    { accessorKey: "orderId", header: "Order Id", enableSorting: false },
    { accessorKey: "reference", header: "Backend Ref" },
    { accessorKey: "createdAt", header: "Created On" },
    { accessorKey: "updatedAt", header: "Last Updated On" },
  ];

  // Custom renderHeader function
  const renderHeader = (headerGroup: HeaderGroup<any>) => (
    <>
      {headerGroup.headers.map((header) => {
        const canSort = header.column.getCanSort();

        return (
          <th key={header.id} className="py-3 font-medium p-6">
            <div
              {...{
                onClick: canSort
                  ? header.column.getToggleSortingHandler()
                  : undefined,
                style: { cursor: canSort ? "pointer" : "default" },
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
        );
      })}
    </>
  );

  // Custom renderRow function
  const renderRow = (row: Row<any>) => (
    <tr
      key={row.id}
      className="cursor-pointer py-5 border-b-1 border-[#EAECF0] hover:bg-[#F3F4F7]"
      onClick={() => {
        setSelectedTransactionId(row.original.id);
        setIsTransactionDetailOpen(true);
      }}
    >
      {row.getVisibleCells().map((cell) => {
        if (cell.column.id === "customerName") {
          return (
            <td key={cell.id} className="py-4 p-6">
              <div className="space-y-1">
                <p className="font-crimson text-sm font-bold text-[#101828] capitalize">
                  {cell.row.original.customerName || "Guest customer"}
                </p>
                <p className="font-inter text-xs text-[#667085]">
                  {cell.row.original.customerEmail || cell.row.original.userId || "N/A"}
                </p>
              </div>
            </td>
          );
        }

        // Amount
        if (cell.column.id === "amount") {
          return (
            <td key={cell.id} className="py-4 p-6">
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.TRANSACTION_AMOUNT}
              />
            </td>
          );
        }

        // Gateway
        if (cell.column.id === "gateway") {
          return (
            <td key={cell.id} className="py-4 p-6">
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.TRANSACTION_MEDIUM}
              />
            </td>
          );
        }

        // Transaction Status
        if (cell.column.id === "status") {
          return (
            <td key={cell.id} className="py-4 p-6">
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.TRANSACTION_STATUS}
              />
            </td>
          );
        }

        if (cell.column.id === "paymentOption") {
          return (
            <td key={cell.id} className="py-4 p-6">
              <p className="font-inter text-sm font-medium text-[#101828]">
                {cell.row.original.paymentOption || "N/A"}
              </p>
            </td>
          );
        }

        if (cell.column.id === "orderId") {
          return (
            <td key={cell.id} className="py-4 p-6">
              <p className="font-inter text-sm font-medium text-[#101828]">
                {cell.row.original.orderId || "N/A"}
              </p>
            </td>
          );
        }

        // Created At
        if (cell.column.id === "createdAt") {
          return (
            <td key={cell.id} className="py-4 p-6">
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
            <td key={cell.id} className="py-4 p-6">
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.UPDATED_AT_DATE}
              />
            </td>
          );
        }

        // Default
        return (
          <td
            key={cell.id}
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

  const [pageIndex, setPageIndex] = useState(defaultPageIndex);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [globalFilter, setGlobalFilter] = useState(defaultGlobalFilter);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(
    null
  );
  const [isTransactionDetailOpen, setIsTransactionDetailOpen] =
    useState(false);
  const transactionStatus = query.get("tab") || "";

  // State for filters
  const [isDeleted, setIsDeleted] = useState<boolean | undefined>(
    defaultIsDeleted
  );
  const [isRequestDelete, setIsRequestDelete] = useState<boolean | undefined>(
    defaultIsRequestDelete
  );

  // Fetch the transactions using your actual API
  const {
    data: transactionsResponse, // Fetch the response which contains the result and other meta info
    isLoading,
    isError,
    refetch,
    error,
  } = ApiTransactionStoreSlice.useGetTransactionsQuery({
    pageIndex,
    pageSize,
    sorting: sorting.map(({ id, desc }) => ({ id, desc })),
    globalFilter,
    isDeleted, // Pass isDeleted filter
    isRequestDelete, // Pass isRequestDelete filter
    transactionStatus,
  });

  const transactions = transactionsResponse?.data?.results || [];

  // Transform data based on filter logic
  const filteredTransactions = transactions.filter((transaction: any) => {
    const isDeletedMatch = isDeleted
      ? transaction.accountEnabled === isDeleted
      : true;
    const requestDeleteMatch = isRequestDelete
      ? transaction.approval === isRequestDelete
      : true;

    if (isDeleted || !isRequestDelete) return transaction;

    return isDeletedMatch && requestDeleteMatch;
  });

  const totalItems = transactionsResponse?.data?.count || 0;
  const pageCount = Math.ceil(totalItems / pageSize);

  const fetchData = (
    pageIndex: number,
    pageSize: number,
    sorting: SortingState,
    globalFilter: string
  ) => {
    setPageIndex(pageIndex);
    setPageSize(pageSize);
    setSorting(sorting);
    setGlobalFilter(globalFilter);
    setIsDeleted(isDeleted);
    setIsRequestDelete(isRequestDelete);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sortingValue = sorting?.length
      ? `${sorting[0].id},${sorting[0].desc ? "desc" : "asc"}`
      : "";
    const isDefaultSorting =
      sortingValue === `${DEFAULT_TRANSACTION_SORTING[0].id},${
        DEFAULT_TRANSACTION_SORTING[0].desc ? "desc" : "asc"
      }`;

    if (pageIndex > 0) {
      params.set("page", String(pageIndex + 1));
    } else {
      params.delete("page");
    }

    if (pageSize !== PAGINATION_DEFAULT.limit) {
      params.set("limit", String(pageSize));
    } else {
      params.delete("limit");
    }

    if (globalFilter) {
      params.set("q", globalFilter);
    } else {
      params.delete("q");
    }

    if (sortingValue && !isDefaultSorting) {
      params.set("sort", sortingValue);
    } else {
      params.delete("sort");
    }

    if (isDeleted) {
      params.set("isDeleted", "true");
    } else {
      params.delete("isDeleted");
    }

    if (isRequestDelete) {
      params.set("isRequestDelete", "true");
    } else {
      params.delete("isRequestDelete");
    }

    const nextSearch = params.toString();
    const currentSearch = location.search.replace(/^\?/, "");

    if (nextSearch !== currentSearch) {
      navigate(
        {
          pathname: location.pathname,
          search: nextSearch,
        },
        { replace: true }
      );
    }
  }, [
    globalFilter,
    isDeleted,
    isRequestDelete,
    location.pathname,
    location.search,
    navigate,
    pageIndex,
    pageSize,
    sorting,
  ]);

  if (isError) {
    showErrorSnackbar(error?.message || "Error occured");
  }

  const handleExportCSV = () => {
    exportToCSV(filteredTransactions, "table_data");
  };

  return (
    <>
      {filteredTransactions.length <= 0 ? (
        <div className="flex items-center gap-3 mt-4">
          <Search
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />

          <Filter
            isDeleted={isDeleted}
            setIsDeleted={setIsDeleted}
            isRequestDelete={isRequestDelete}
            setIsRequestDelete={setIsRequestDelete}
          />

          <Button
            variant="outlined"
            startIcon={<Share01 width={20} height={20} />}
            className="capitalize font-bold font-inter flex items-center justify-center"
            size="medium"
            onClick={handleExportCSV}
          >
            <Tooltip title="Download CSV">
              <p>Export</p>
            </Tooltip>
          </Button>
        </div>
      ) : null}

      <LoadingContent
        loading={isLoading}
        error={isError}
        onReload={refetch}
        loadingContent={<TableSkeletonLoader />}
        errorContent={<TableError onReload={() => refetch()} />}
        emptyContent={<TableEmpty />}
        data={filteredTransactions}
      >
        <ReusableTable
          columns={columns}
          data={filteredTransactions}
          pageCount={pageCount}
          defaultSorting={defaultSorting}
          defaultGlobalFilter={defaultGlobalFilter}
          defaultPageIndex={defaultPageIndex}
          defaultPageSize={defaultPageSize}
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
              className="capitalize font-bold font-inter flex items-center justify-center"
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

      <TransactionDetailModal
        open={isTransactionDetailOpen}
        transactionId={selectedTransactionId}
        onClose={() => {
          setIsTransactionDetailOpen(false);
          setSelectedTransactionId(null);
        }}
      />
    </>
  );
};

export default TransactionTable;
