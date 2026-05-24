import { flexRender, Row, HeaderGroup } from "@tanstack/react-table";
import { Button, Popover, Tooltip } from "@mui/material";
import { DotsVertical, Share01 } from "@untitled-ui/icons-react";
import { useState, useEffect } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import ReusableTable from "@/common/Table/ReuseableTable";
import { Pagination } from "@/common/Table/Pagination";
import Search from "@/common/Table/Search";

import Filter from "@/common/Table/Filter";

import TableText from "@/common/Table/TableText";
import { ApiReviewStoreSlice } from "@/api/ApiReviewStoreSlice";
import { TABLE_ROW_TYPE } from "@/constants/enums";
// import { useQuery } from "@/hooks/useQuery";
import TableSkeletonLoader from "@/common/Table/TableSkeletonLoader";
import TableEmpty from "@/common/Table/TableEmpty";
import { User } from "@/types/user";
import LoadingContent from "@/common/LoadingContent/LoadingContent";
import useExtendedSnackbar from "@/hooks/useExtendedSnackbar";
import TableError from "@/common/Table/TableError";
import { exportToCSV } from "@/helpers/exportToCSV";
import { PAGINATION_DEFAULT } from "@/constants/AppConstants";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { useQueryParam } from "@/hooks/useQueryParam";
import ReviewDeactivateButton from "./components/ReviewDeactivateButton";
import ReviewReactivateButton from "./components/ReviewReactivateButton";

const ReviewTable = () => {
  // const query = useQuery();
  const { get } = useQueryParam();
  const { showErrorSnackbar } = useExtendedSnackbar();

  const columns: ColumnDef<any, any>[] = [
    // { accessorKey: "id", header: "Review ID" },
    { accessorKey: "product", header: "Product Name" },
    { accessorKey: "name", header: "Review's Name" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "createdAt", header: "Created On" },
    { accessorKey: "updatedAt", header: "Last Updated On" },
    { accessorKey: "isDeleted", header: "Review Deleted" },
    {
      accessorKey: "action",
      header: () => <></>, // Keep the header empty or customize it
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <PopupState variant="popover" popupId="tour-table">
            {(popupState: any) => (
              <>
                <div
                  className="cursor-pointer p-2"
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
                    <ReviewDeactivateButton
                      disable={!!row.original.isDeleted}
                      reviewId={row.original.id}
                    />
                    <ReviewReactivateButton
                      disable={!!row.original.isDeleted}
                      reviewId={row.original.id}
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
        <th key={header.id} className="py-3 font-medium p-6">
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
  const renderRow = (row: Row<any>) => (
    <tr
      key={row.id}
      className="py-5 border-b-1 border-[#EAECF0] hover:bg-[#F3F4F7] cursor-pointer"
    >
      {row.getVisibleCells().map((cell) => {
        // Name
        if (cell.column.id === "product") {
          return (
            <td key={cell.id} className="py-4 p-6">
              <TableText
                value={cell.row.original?.product}
                type={TABLE_ROW_TYPE.PRODUCT_NAME}
              />
            </td>
          );
        }

        if (cell.column.id === "name") {
          return (
            <td key={cell.id} className="py-4 p-6">
              <TableText
                value={cell.row.original?.user}
                type={TABLE_ROW_TYPE.REVIEW_NAME}
              />
            </td>
          );
        }

        // Description
        if (cell.column.id === "description") {
          return (
            <td key={cell.id} className="py-4 p-6">
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.REVIEW_DESCRIPTION}
              />
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

        // Is deleted
        if (cell.column.id === "isDeleted") {
          return (
            <td key={cell.id} className="py-4 p-6">
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.CLIENT_ACCOUNT_DELETED}
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

  const [pageIndex, setPageIndex] = useState(PAGINATION_DEFAULT.page);
  const [pageSize, setPageSize] = useState(PAGINATION_DEFAULT.limit);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const reviewStatus = get("tab") || "";
  const pageIndexFromUrl = get("page") || pageIndex;

  // State for filters
  const [isDeleted, setIsDeleted] = useState<boolean | undefined>(false);
  const [isRequestDelete, setIsRequestDelete] = useState<boolean | undefined>(
    false
  );

  // Fetch the reviews using your actual API
  const {
    data: reviewsResponse, // Fetch the response which contains the result and other meta info
    isLoading,
    isError,
    refetch,
    error,
  } = ApiReviewStoreSlice.useGetReviewsQuery({
    // ...(globalFilter && {
    //   pageIndex: Number(pageIndexFromUrl) || pageIndex,
    // }),
    pageIndex: Number(pageIndexFromUrl) || pageIndex,
    pageSize,
    sorting,
    globalFilter,
    isDeleted, // Pass isDeleted filter
    isRequestDelete, // Pass isRequestDelete filter
    reviewStatus,
  });

  const reviews = reviewsResponse?.data?.results || [];

  // Transform data based on filter logic
  const filteredReviews = reviews.filter((review: any) => {
    const isDeletedMatch = isDeleted
      ? review.accountEnabled === isDeleted
      : true;
    const requestDeleteMatch = isRequestDelete
      ? review.approval === isRequestDelete
      : true;

    if (isDeleted || !isRequestDelete) return review;

    return isDeletedMatch && requestDeleteMatch;
  });

  const totalItems = reviewsResponse?.data?.count;
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
    exportToCSV(filteredReviews, "table_data");
  };

  return (
    <>
      {filteredReviews.length <= 0 ? (
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
              className="capitalize font-bold font-inter flex items-center justify-center"
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
        data={filteredReviews}
      >
        <ReusableTable
          columns={columns}
          data={filteredReviews}
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
    </>
  );
};

export default ReviewTable;
