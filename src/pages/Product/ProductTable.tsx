import { flexRender, Row, HeaderGroup } from "@tanstack/react-table";
import { Button, Popover, Tooltip, Typography } from "@mui/material";
import {
  DotsVertical,
  Edit01,
  ImageUser,
  Share01,
} from "@untitled-ui/icons-react";
import { useState, useEffect } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import ReusableTable from "@/common/Table/ReuseableTable";
import { Pagination } from "@/common/Table/Pagination";
import Search from "@/common/Table/Search";
import Filter from "@/common/Table/Filter";
import { generatePath, Link, useLocation, useNavigate } from "react-router-dom";
import { routeEnum } from "@/constants/RouteConstants";
import TableText from "@/common/Table/TableText";
import { ApiProductStoreSlice } from "@/api/ApiProductStoreSlice";
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

const DEFAULT_PRODUCT_SORTING: SortingState = [
  { id: "createdAt", desc: true },
];

const parsePositiveInteger = (value: string | null, fallback: number) => {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
};

const parseProductSorting = (value: string | null): SortingState => {
  if (!value) {
    return DEFAULT_PRODUCT_SORTING;
  }

  const [id, direction] = value.split(",");

  if (!id) {
    return DEFAULT_PRODUCT_SORTING;
  }

  return [{ id, desc: direction !== "asc" }];
};

const ProductTable = () => {
  const query = useQuery();
  const location = useLocation();
  const { showErrorSnackbar } = useExtendedSnackbar();
  const navigate = useNavigate();
  const defaultSorting = parseProductSorting(query.get("sort"));
  const defaultPageIndex =
    parsePositiveInteger(query.get("page"), PAGINATION_DEFAULT.page) - 1;
  const defaultPageSize = parsePositiveInteger(
    query.get("limit"),
    PAGINATION_DEFAULT.limit
  );
  const defaultGlobalFilter = query.get("q") || "";
  const defaultIsDeleted = query.get("isDeleted") === "true";
  const defaultIsRequestDelete = query.get("isRequestDelete") === "true";

  const handleGotoProduct = (id: string) => {
    const route = generatePath(routeEnum.PRODUCT_DETAILS, {
      id,
    });
    navigate(route);
  };

  const columns: ColumnDef<any, any>[] = [
    // { accessorKey: "id", header: "Product ID" },
    { accessorKey: "name", header: "Product's Name" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "modelNumber", header: "Model Number" },
    { accessorKey: "price", header: "Cost" },
    { accessorKey: "stock", header: "In-Stock" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "subcategory", header: "Sub Category" },
    { accessorKey: "createdAt", header: "Created On" },
    { accessorKey: "updatedAt", header: "Last Updated On" },
    { accessorKey: "isDeleted", header: "Product Deleted" },
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
                    <Link
                      to={`${generatePath(routeEnum.PRODUCT_DETAILS, {
                        id: row.original.id,
                      })}`}
                      className="flex items-center justify-start gap-2 py-3 px-4 hover:bg-slate-50 cursor-pointer"
                    >
                      <ImageUser width={20} height={20} />
                      <Typography
                        color="grey.700"
                        className="text-xs font-inter font-medium capitalize"
                      >
                        View product
                      </Typography>
                    </Link>

                    <Link
                      to={generatePath(`${routeEnum.PRODUCTS_UPDATE}`, {
                        id: row.original.id,
                      })}
                      className="flex items-center justify-start gap-2 py-3 px-4 hover:bg-slate-50 cursor-pointer"
                    >
                      <Edit01 width={20} height={20} />
                      <Typography
                        color="grey.700"
                        className="text-xs font-inter font-medium"
                      >
                        Update Product
                      </Typography>
                    </Link>
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
  const renderRow = (row: Row<User>) => (
    <tr
      key={row.id}
      className="py-5 border-b-1 border-[#EAECF0] hover:bg-[#F3F4F7] cursor-pointer"
    >
      {row.getVisibleCells().map((cell) => {
        // Name
        if (cell.column.id === "name") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoProduct(cell.row.original.id)}
              className="py-4 p-6"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.PRODUCT_NAME}
              />
            </td>
          );
        }

        // Description
        if (cell.column.id === "description") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoProduct(cell.row.original.id)}
              className="py-4 p-6"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.PRODUCT_DESCRIPTION}
              />
            </td>
          );
        }

        // Cost
        if (cell.column.id === "price") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoProduct(cell.row.original.id)}
              className="py-4 p-6"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.PRICE}
              />
            </td>
          );
        }

        // In Stock
        if (cell.column.id === "stock") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoProduct(cell.row.original.id)}
              className="py-4 p-6"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.STOCK}
              />
            </td>
          );
        }

        // Category
        if (cell.column.id === "category") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoProduct(cell.row.original.id)}
              className="py-4 p-6"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.CATEGORY}
              />
            </td>
          );
        }

        // Sub Category
        if (cell.column.id === "subcategory") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoProduct(cell.row.original.id)}
              className="py-4 p-6"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.SUB_CATEGORY}
              />
            </td>
          );
        }

        // Created At
        if (cell.column.id === "createdAt") {
          return (
            <td
              key={cell.id}
              onClick={() => handleGotoProduct(cell.row.original.id)}
              className="py-4 p-6"
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
              onClick={() => handleGotoProduct(cell.row.original.id)}
              className="py-4 p-6"
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
              onClick={() => handleGotoProduct(cell.row.original.id)}
              className="py-4 p-6"
            >
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
            onClick={() =>
              cell.column.id !== "action" &&
              handleGotoProduct(cell.row.original.id)
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

  const [pageIndex, setPageIndex] = useState(defaultPageIndex);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [globalFilter, setGlobalFilter] = useState(defaultGlobalFilter);
  const productStatus = query.get("tab") || "";

  // State for filters
  const [isDeleted, setIsDeleted] = useState<boolean | undefined>(
    defaultIsDeleted
  );
  const [isRequestDelete, setIsRequestDelete] = useState<boolean | undefined>(
    defaultIsRequestDelete
  );

  // Fetch the products using your actual API
  const {
    data: productsResponse, // Fetch the response which contains the result and other meta info
    isLoading,
    isError,
    refetch,
    error,
  } = ApiProductStoreSlice.useGetProductsQuery({
    pageIndex,
    pageSize,
    sorting: sorting.map(({ id, desc }) => ({ id, desc })),
    globalFilter,
    isDeleted, // Pass isDeleted filter
    isRequestDelete, // Pass isRequestDelete filter
    productStatus,
  });

  const products = productsResponse?.data?.results || [];

  // Transform data based on filter logic
  const filteredProducts = products.filter((product: any) => {
    const isDeletedMatch = isDeleted
      ? product.accountEnabled === isDeleted
      : true;
    const requestDeleteMatch = isRequestDelete
      ? product.approval === isRequestDelete
      : true;

    if (isDeleted || !isRequestDelete) return product;

    return isDeletedMatch && requestDeleteMatch;
  });

  const totalItems = productsResponse?.data?.count || 0;
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
      sortingValue === `${DEFAULT_PRODUCT_SORTING[0].id},${
        DEFAULT_PRODUCT_SORTING[0].desc ? "desc" : "asc"
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
    exportToCSV(filteredProducts, "table_data");
  };

  return (
    <>
      {filteredProducts.length <= 0 ? (
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
        data={filteredProducts}
      >
        <ReusableTable
          columns={columns}
          data={filteredProducts}
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
    </>
  );
};

export default ProductTable;
