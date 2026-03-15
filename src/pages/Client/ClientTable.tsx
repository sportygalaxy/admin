import { flexRender, Row, HeaderGroup } from "@tanstack/react-table";
import { Button, Tooltip } from "@mui/material";
import { Share01 } from "@untitled-ui/icons-react";
import { useState, useEffect } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import ReusableTable from "@/common/Table/ReuseableTable";
import { Pagination } from "@/common/Table/Pagination";
import Search from "@/common/Table/Search";

import Filter from "@/common/Table/Filter";

import { generatePath, useLocation, useNavigate } from "react-router-dom";
import { routeEnum } from "@/constants/RouteConstants";
import TableText from "@/common/Table/TableText";
import { ApiClientStoreSlice } from "@/api/ApiClientStoreSlice";
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
import UserRoleBadge from "@/common/UserRoleBadge";
import { TEAM_ROLES, type UserRole } from "@/constants/roles";

const DEFAULT_CLIENT_SORTING: SortingState = [{ id: "createdAt", desc: true }];

const parsePositiveInteger = (value: string | null, fallback: number) => {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
};

const parseClientSorting = (value: string | null): SortingState => {
  if (!value) {
    return DEFAULT_CLIENT_SORTING;
  }

  const [id, direction] = value.split(",");

  if (!id) {
    return DEFAULT_CLIENT_SORTING;
  }

  return [{ id, desc: direction !== "asc" }];
};

const ClientTable = () => {
  const query = useQuery();
  const location = useLocation();
  const { showErrorSnackbar } = useExtendedSnackbar();
  const navigate = useNavigate();
  const defaultSorting = parseClientSorting(query.get("sort"));
  const defaultPageIndex =
    parsePositiveInteger(query.get("page"), PAGINATION_DEFAULT.page) - 1;
  const defaultPageSize = parsePositiveInteger(
    query.get("limit"),
    PAGINATION_DEFAULT.limit
  );
  const defaultGlobalFilter = query.get("q") || "";
  const defaultIsDeleted = query.get("isDeleted") === "true";
  const defaultIsRequestDelete = query.get("isRequestDelete") === "true";

  const handleGotoProfile = (id: string, role?: UserRole) => {
    const route = generatePath(
      TEAM_ROLES.includes((role || "USER") as UserRole)
        ? routeEnum.USERS_EMPLOYEE_DETAILS
        : routeEnum.USERS_CLIENT_DETAILS,
      {
        id,
      }
    );
    navigate(route);
  };

  const columns: ColumnDef<any, any>[] = [
    { accessorKey: "name", header: "User's Name" },
    // { accessorKey: "id", header: "ID" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "isVerified", header: "Account Verified" },
    { accessorKey: "isDeleted", header: "Account Deleted" },
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
              onClick={() =>
                handleGotoProfile(cell.row.original.id, cell.row.original.role)
              }
              className="py-4 p-6"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.CLIENT_NAME}
              />
            </td>
          );
        }

        // Verified
        if (cell.column.id === "isVerified") {
          return (
            <td
              key={cell.id}
              onClick={() =>
                handleGotoProfile(cell.row.original.id, cell.row.original.role)
              }
              className="py-4 p-6"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.STATUS}
              />
            </td>
          );
        }

        // Is deleted
        if (cell.column.id === "isDeleted") {
          return (
            <td
              key={cell.id}
              onClick={() =>
                handleGotoProfile(cell.row.original.id, cell.row.original.role)
              }
              className="py-4 p-6"
            >
              <TableText
                value={cell.row.original}
                type={TABLE_ROW_TYPE.CLIENT_ACCOUNT_DELETED}
              />
            </td>
          );
        }

        if (cell.column.id === "role") {
          return (
            <td
              key={cell.id}
              onClick={() =>
                handleGotoProfile(cell.row.original.id, cell.row.original.role)
              }
              className="py-4 p-6"
            >
              <UserRoleBadge role={cell.row.original.role} />
            </td>
          );
        }

        // Default
        return (
          <td
            key={cell.id}
            onClick={() =>
              handleGotoProfile(cell.row.original.id, cell.row.original.role)
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
  const clientStatus = query.get("tab") || "";

  // State for filters
  const [isDeleted, setIsDeleted] = useState<boolean | undefined>(
    defaultIsDeleted
  );
  const [isRequestDelete, setIsRequestDelete] = useState<boolean | undefined>(
    defaultIsRequestDelete
  );

  // Fetch the clients using your actual API
  const {
    data: clientsResponse, // Fetch the response which contains the result and other meta info
    isLoading,
    isError,
    refetch,
    error,
  } = ApiClientStoreSlice.useGetClientsQuery({
    pageIndex,
    pageSize,
    sorting: sorting.map(({ id, desc }) => ({ id, desc })),
    globalFilter,
    isDeleted, // Pass isDeleted filter
    isRequestDelete, // Pass isRequestDelete filter
    clientStatus,
  });

  const clients = clientsResponse?.data?.results || [];

  // Transform data based on filter logic
  const filteredClients = clients.filter((client: any) => {
    const isDeletedMatch = isDeleted
      ? client.accountEnabled === isDeleted
      : true;
    const requestDeleteMatch = isRequestDelete
      ? client.approval === isRequestDelete
      : true;

    if (isDeleted || !isRequestDelete) return client;

    return isDeletedMatch && requestDeleteMatch;
  });

  const totalItems = clientsResponse?.data?.count || 0;
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
    fetchData(pageIndex, pageSize, sorting, globalFilter);
  }, [pageIndex, pageSize, sorting, globalFilter, isDeleted, isRequestDelete]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sortingValue = sorting?.length
      ? `${sorting[0].id},${sorting[0].desc ? "desc" : "asc"}`
      : "";
    const isDefaultSorting =
      sortingValue === `${DEFAULT_CLIENT_SORTING[0].id},${
        DEFAULT_CLIENT_SORTING[0].desc ? "desc" : "asc"
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
    exportToCSV(filteredClients, "table_data");
  };

  return (
    <>
      {filteredClients.length <= 0 ? (
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
        data={filteredClients}
      >
        <ReusableTable
          columns={columns}
          data={filteredClients}
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

export default ClientTable;
