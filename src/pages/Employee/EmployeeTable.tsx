import { flexRender, Row, HeaderGroup } from "@tanstack/react-table";
import { Button, Tooltip } from "@mui/material";
import { Share01 } from "@untitled-ui/icons-react";
import { useState, useEffect } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import ReusableTable from "@/common/Table/ReuseableTable";
import { Pagination } from "@/common/Table/Pagination";
import Search from "@/common/Table/Search";

import Filter from "@/common/Table/Filter";

import { generatePath, useNavigate } from "react-router-dom";
import { routeEnum } from "@/constants/RouteConstants";
import TableText from "@/common/Table/TableText";
import { ApiEmployeeStoreSlice } from "@/api/ApiEmployeeStoreSlice";
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

const EmployeeTable = () => {
  const query = useQuery();
  const { showErrorSnackbar } = useExtendedSnackbar();
  const navigate = useNavigate();

  const handleGotoProfile = (id: string) => {
    const route = generatePath(routeEnum.USERS_EMPLOYEE_DETAILS, {
      id,
    });
    navigate(route);
  };

   const columns: ColumnDef<any, any>[] = [
     { accessorKey: "name", header: "Team Member's Name" },
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
              onClick={() => handleGotoProfile(cell.row.original.id)}
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
              onClick={() => handleGotoProfile(cell.row.original.id)}
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
              onClick={() => handleGotoProfile(cell.row.original.id)}
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
              onClick={() => handleGotoProfile(cell.row.original.id)}
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
            onClick={() => handleGotoProfile(cell.row.original.id)}
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
  const employeeStatus = query.get("tab") || "";

  // State for filters
  const [isDeleted, setIsDeleted] = useState<boolean | undefined>(false);
  const [isRequestDelete, setIsRequestDelete] = useState<boolean | undefined>(
    false
  );

  // Fetch the employees using your actual API
  const {
    data: employeesResponse, // Fetch the response which contains the results and other meta info
    isLoading,
    isError,
    refetch,
    error,
  } = ApiEmployeeStoreSlice.useGetEmployeesQuery({
    pageIndex,
    pageSize,
    sorting,
    globalFilter,
    isDeleted, // Pass isDeleted filter
    isRequestDelete, // Pass isRequestDelete filter
    employeeStatus,
  });
  const employees = employeesResponse?.data?.results || [];

  // Transform data based on filter logic
  const filteredEmployees = employees.filter((employee: any) => {
    const isDeletedMatch = isDeleted
      ? employee.accountEnabled === isDeleted
      : true;
    const requestDeleteMatch = isRequestDelete
      ? employee.approval === isRequestDelete
      : true;

    if (isDeleted || !isRequestDelete) return employee;

    return isDeletedMatch && requestDeleteMatch;
  });

  const pageCount = employeesResponse?.data?.pageCount;

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

  if (isError) {
    showErrorSnackbar(error?.message || "Error occured");
  }

  const handleExportCSV = () => {
    exportToCSV(filteredEmployees, "table_data");
  };

  return (
    <>
      {filteredEmployees.length <= 0 ? (
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
        data={filteredEmployees}
      >
        <ReusableTable
          columns={columns}
          data={filteredEmployees}
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

export default EmployeeTable;
