import {
  flexRender,
  HeaderGroup,
  Row,
  SortingState,
} from "@tanstack/react-table";
import { Button, Tooltip, Typography } from "@mui/material";
import { Share01 } from "@untitled-ui/icons-react";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import ReusableTable from "@/common/Table/ReuseableTable";
import { Pagination } from "@/common/Table/Pagination";
import Search from "@/common/Table/Search";
import Filter from "@/common/Table/Filter";
import LoadingContent from "@/common/LoadingContent/LoadingContent";
import TableSkeletonLoader from "@/common/Table/TableSkeletonLoader";
import TableError from "@/common/Table/TableError";
import TableEmpty from "@/common/Table/TableEmpty";
import BackButton from "@/common/BackButton";
import useExtendedSnackbar from "@/hooks/useExtendedSnackbar";
import { ApiUserStoreSlice } from "@/api/ApiUserStoreSlice";
import { PAGINATION_DEFAULT } from "@/constants/AppConstants";
import { exportToCSV } from "@/helpers/exportToCSV";
import { routeEnum } from "@/constants/RouteConstants";
import { USER_ROLE } from "@/constants/roles";
import UserRoleBadge from "@/common/UserRoleBadge";
import useAuthUser from "@/hooks/useAuthUser";
import { useQuery } from "@/hooks/useQuery";
import UserRoleUpdateDialog from "./UserRoleUpdateDialog";

const DEFAULT_ROLE_SORTING: SortingState = [{ id: "createdAt", desc: true }];

const parsePositiveInteger = (value: string | null, fallback: number) => {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
};

const parseRoleSorting = (value: string | null): SortingState => {
  if (!value) {
    return DEFAULT_ROLE_SORTING;
  }

  const [id, direction] = value.split(",");

  if (!id) {
    return DEFAULT_ROLE_SORTING;
  }

  return [{ id, desc: direction !== "asc" }];
};

const UserRoleManagement = () => {
  const query = useQuery();
  const location = useLocation();
  const authUser = useAuthUser();
  const { showErrorSnackbar } = useExtendedSnackbar();
  const navigate = useNavigate();
  const defaultSorting = parseRoleSorting(query.get("sort"));
  const defaultPageIndex =
    parsePositiveInteger(query.get("page"), PAGINATION_DEFAULT.page) - 1;
  const defaultPageSize = parsePositiveInteger(
    query.get("limit"),
    PAGINATION_DEFAULT.limit
  );
  const defaultGlobalFilter = query.get("q") || "";
  const defaultIsDeleted = query.get("isDeleted") === "true";
  const defaultIsRequestDelete = query.get("isRequestDelete") === "true";
  const roleFilter =
    authUser?.role === USER_ROLE.ADMIN
      ? [USER_ROLE.ADMIN, USER_ROLE.STAFF, USER_ROLE.USER]
      : undefined;

  const columns: ColumnDef<any, any>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "isVerified", header: "Verified" },
    { accessorKey: "createdAt", header: "Created On" },
    {
      accessorKey: "action",
      header: () => <div className="text-right">Action</div>,
      enableSorting: false,
    },
  ];

  const renderHeader = (headerGroup: HeaderGroup<any>) => (
    <>
      {headerGroup.headers.map((header) => (
        <th key={header.id} className="p-6 py-3 font-medium">
          <div
            {...{
              onClick: header.column.getCanSort()
                ? header.column.getToggleSortingHandler()
                : undefined,
              style: {
                cursor: header.column.getCanSort() ? "pointer" : "default",
              },
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

  const handleOpenUser = (user: any) => {
    const route = generatePath(
      user.role === USER_ROLE.USER
        ? routeEnum.USERS_CLIENT_DETAILS
        : routeEnum.USERS_EMPLOYEE_DETAILS,
      { id: user.id }
    );

    navigate(route);
  };

  const renderRow = (row: Row<any>) => (
    <tr
      key={row.id}
      className="py-5 border-b-1 border-[#EAECF0] hover:bg-[#F3F4F7] cursor-pointer"
      onClick={() => handleOpenUser(row.original)}
    >
      {row.getVisibleCells().map((cell) => {
        if (cell.column.id === "name") {
          return (
            <td key={cell.id} className="p-6 py-4">
              <div className="space-y-1">
                <Typography
                  color="grey.900"
                  className="font-semibold font-inter"
                >
                  {[cell.row.original.firstName, cell.row.original.lastName]
                    .filter(Boolean)
                    .join(" ") || "N/A"}
                </Typography>
                <Typography color="grey.600" className="text-xs font-inter">
                  {cell.row.original.phone || "No phone"}
                </Typography>
              </div>
            </td>
          );
        }

        if (cell.column.id === "role") {
          return (
            <td key={cell.id} className="p-6 py-4">
              <UserRoleBadge role={cell.row.original.role} />
            </td>
          );
        }

        if (cell.column.id === "isVerified") {
          return (
            <td key={cell.id} className="p-6 py-4">
              <Typography color="grey.700" className="text-sm font-inter">
                {cell.row.original.isVerified ? "Verified" : "Pending"}
              </Typography>
            </td>
          );
        }

        if (cell.column.id === "createdAt") {
          return (
            <td key={cell.id} className="p-6 py-4">
              <Typography color="grey.700" className="text-sm font-inter">
                {new Date(cell.row.original.createdAt).toLocaleString()}
              </Typography>
            </td>
          );
        }

        if (cell.column.id === "action") {
          return (
            <td
              key={cell.id}
              className="p-6 py-4 text-right"
              onClick={(event) => event.stopPropagation()}
            >
              <UserRoleUpdateDialog user={cell.row.original} />
            </td>
          );
        }

        return (
          <td key={cell.id} className="p-6 py-4">
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
  const [isDeleted, setIsDeleted] = useState<boolean | undefined>(
    defaultIsDeleted
  );
  const [isRequestDelete, setIsRequestDelete] = useState<boolean | undefined>(
    defaultIsRequestDelete
  );

  const {
    data: usersResponse,
    isLoading,
    isError,
    refetch,
    error,
  } = ApiUserStoreSlice.useGetUsersQuery({
    pageIndex,
    pageSize,
    sorting: sorting.map(({ id, desc }) => ({ id, desc })),
    globalFilter,
    roles: roleFilter,
    isDeleted,
    isRequestDelete,
  });

  const users = usersResponse?.data?.results || [];
  const totalItems = usersResponse?.data?.count || 0;
  const pageCount = Math.ceil(totalItems / pageSize);

  const fetchData = (
    nextPageIndex: number,
    nextPageSize: number,
    nextSorting: SortingState,
    nextGlobalFilter: string
  ) => {
    setPageIndex(nextPageIndex);
    setPageSize(nextPageSize);
    setSorting(nextSorting);
    setGlobalFilter(nextGlobalFilter);
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
      sortingValue === `${DEFAULT_ROLE_SORTING[0].id},${
        DEFAULT_ROLE_SORTING[0].desc ? "desc" : "asc"
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
    showErrorSnackbar((error as any)?.message || "Error occured");
  }

  return (
    <div className="container-wrapper py-[30px] h-[calc(100vh-118.5px)]">
      <div className="flex items-end justify-between">
        <div className="space-y-5">
          <BackButton />
          <div>
            <Typography
              color="grey.900"
              className="text-2xl font-bold font-crimson"
            >
              Role Management
            </Typography>
            <Typography color="grey.600" className="mt-1 text-sm font-inter">
              View users by access level and assign admin roles safely.
            </Typography>
          </div>
        </div>
        <Button
          variant="outlined"
          startIcon={<Share01 width={20} height={20} />}
          className="flex items-center justify-center font-bold capitalize font-inter"
          size="medium"
          onClick={() => exportToCSV(users, "user_roles")}
        >
          <Tooltip title="Download CSV">
            <p>Export</p>
          </Tooltip>
        </Button>
      </div>

      <LoadingContent
        loading={isLoading}
        error={isError}
        onReload={refetch}
        loadingContent={<TableSkeletonLoader />}
        errorContent={<TableError onReload={() => refetch()} />}
        emptyContent={<TableEmpty />}
        data={users}
      >
        <ReusableTable
          columns={columns}
          data={users}
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
          renderHeader={renderHeader}
          renderRow={renderRow}
        />
      </LoadingContent>
    </div>
  );
};

export default UserRoleManagement;
