import { useEffect, useState, FC } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  ColumnDef,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import Button from "@mui/material/Button/Button";
import { FilterLines } from "@untitled-ui/icons-react";
import { PAGINATION_DEFAULT } from "@/constants/AppConstants";

interface ReusableTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  pageCount: number;
  defaultSorting?: SortingState;
  defaultGlobalFilter?: string;
  defaultPageIndex?: number;
  defaultPageSize?: number;
  fetchData: (
    pageIndex: number,
    pageSize: number,
    sorting: SortingState,
    globalFilter: string,
  ) => void;
  PaginationComponent?: FC<{
    table: ReturnType<typeof useReactTable>;
    setPageSize: (size: number) => void;
  }>;
  SearchComponent?: FC<{
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
  }>;
  FilterComponent?: JSX.Element;
  ExportComponent?: JSX.Element;
  renderHeader?: (headerGroup: any) => React.ReactNode;
  renderRow?: (row: any) => React.ReactNode;
}

const ReusableTable = <TData,>({
  columns,
  data,
  pageCount,
  defaultSorting,
  defaultGlobalFilter,
  defaultPageIndex,
  defaultPageSize,
  fetchData,
  PaginationComponent,
  SearchComponent,
  FilterComponent,
  ExportComponent,
  renderHeader,
  renderRow,
}: ReusableTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting ?? []);
  const [globalFilter, setGlobalFilter] = useState(defaultGlobalFilter ?? "");
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: defaultPageIndex ?? PAGINATION_DEFAULT.page,
    pageSize: defaultPageSize ?? PAGINATION_DEFAULT.limit,
  });

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      globalFilter,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // Enable server-side pagination
    manualSorting: true, // Enable server-side sorting
    manualFiltering: true, // Enable server-side filtering
  });

  useEffect(() => {
    fetchData(pageIndex, pageSize, sorting, globalFilter); // Trigger data fetch on change
  }, [pageIndex, pageSize, sorting, globalFilter]);

  return (
    <>
      <div className="flex items-center gap-3 mt-4">
        {SearchComponent ? (
          <SearchComponent
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        ) : (
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="border p-2 rounded"
          />
        )}

        {FilterComponent ? (
          FilterComponent
        ) : (
          <>
            <Button
              variant="ghost"
              startIcon={<FilterLines width={20} height={20} />}
              className="capitalize font-bold font-inter"
              size="medium"
            >
              Filter
            </Button>
          </>
        )}

        {ExportComponent}
      </div>

      <div className="mt-10">
        <table className="w-full text-left">
          {/* table-fixed */}
          <thead className="bg-[#F2F4F7] text-[#667085] text-xs border-b-1 border-[#F9FAFB]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {renderHeader
                  ? renderHeader(headerGroup) // Render custom header if provided
                  : headerGroup.headers.map((header) => (
                      <th key={header.id} className="py-3 font-medium p-6">
                        <div
                          {...{
                            onClick: header.column.getToggleSortingHandler(),
                            style: { cursor: "pointer" },
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted()
                            ? header.column.getIsSorted() === "desc"
                              ? " ▼"
                              : " ▲"
                            : null}
                        </div>
                      </th>
                    ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-[#FFF] text-[#667085] text-sm">
            {table.getRowModel().rows.map((row) =>
              renderRow ? (
                renderRow(row) // Render custom row if provided
              ) : (
                <tr
                  key={row.id}
                  className="py-5 border-b-1 border-[#EAECF0] hover:bg-[#F3F4F7]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-4 p-6">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {PaginationComponent ? (
        <PaginationComponent
          table={table as ReturnType<typeof useReactTable>}
          setPageSize={(size) => table.setPageSize(size)}
        />
      ) : (
        <div className="mt-4">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border p-2 rounded"
          >
            Previous
          </button>

          <span className="mx-2">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border p-2 rounded"
          >
            Next
          </button>
        </div>
      )}

      {PaginationComponent ? null : (
        <div className="mt-4">
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};

export default ReusableTable;
