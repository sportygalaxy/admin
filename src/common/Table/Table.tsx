import { FC, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  flexRender,
} from "@tanstack/react-table";
import { PAGINATION_DEFAULT } from "@/constants/AppConstants";

interface TableProps {
  columns: any[];
  data: any[];
}

const Table: FC<TableProps> = ({ columns, data }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: PAGINATION_DEFAULT.page,
    pageSize: PAGINATION_DEFAULT.limit,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  return (
    <div className="relative">
      <input
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        className="mb-4 p-2 border"
      />
      <div className="table-mobile-scroll">
        <table className="table-fixed w-full text-left">
          <thead className=" bg-[#F2F4F7] text-[#667085] text-xs border-b-1 border-[#F9FAFB]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="py-3 font-medium p-6 cursor-pointer"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted()
                      ? header.column.getIsSorted() === "desc"
                        ? " ▼"
                        : " ▲"
                      : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-[#FFF] text-[#667085] text-sm">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="py-5 border-b-1 border-[#EAECF0] hover:bg-[#F3F4F7]"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-4 p-6">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination mt-4 flex justify-between">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span>
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
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
    </div>
  );
};

export default Table;
