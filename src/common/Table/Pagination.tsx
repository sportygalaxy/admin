import { useQueryParam } from "@/hooks/useQueryParam";
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useReactTable } from "@tanstack/react-table";
import { ArrowLeft, ArrowRight } from "@untitled-ui/icons-react";
import { FC, useEffect } from "react";

export const Pagination: FC<{
  table: ReturnType<typeof useReactTable>;
  setPageSize: (size: number) => void;
}> = ({ table, setPageSize }) => {
  const { set, get, remove } = useQueryParam();

  // Sync table pageIndex with query param on mount
  useEffect(() => {
    const pageFromQuery = Number(get("page")) || 1;
    if (pageFromQuery > 0 && pageFromQuery <= table.getPageCount()) {
      table.setPageIndex(pageFromQuery - 1); // react-table is 0-based
    }
  }, []);

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  const handlePrevious = () => {
    if (currentPage > 1) {
      table.previousPage();
      const newPage = currentPage - 1;
      if (newPage === 1) {
        remove(["page", "limit"]);
      } else {
        set({ page: newPage });
      }
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      table.nextPage();
      set({ page: currentPage + 1 });
    }
  };

  return (
    <div className="mt-8">
      <Divider />
      <div className="flex flex-col gap-4 py-4 md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-6">
        <Button
          variant="ghost"
          startIcon={<ArrowLeft width={20} height={20} />}
          className="w-full justify-center capitalize font-bold font-inter md:w-auto md:justify-start"
          size="small"
          onClick={handlePrevious}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-center">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-[#667085]">
            <span>Page</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ECFDF3] p-4 text-sm font-medium font-inter text-[#039855]">
              {currentPage}
            </span>
            <span>of</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full p-4 text-sm font-medium font-inter text-[#667085]">
              {totalPages}
            </span>
          </div>

          <FormControl className="w-full md:min-w-[140px] md:w-auto">
            <InputLabel id="select-label"></InputLabel>
            <Select
              size="small"
              className="w-full text-primary-main font-inter font-bold text-sm md:w-auto"
              labelId="select-label"
              value={table.getState().pagination.pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              renderValue={(selected) => `Show ${selected}`}
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <MenuItem key={size} value={size}>
                  Show {size}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText></FormHelperText>
          </FormControl>
        </div>

        <Button
          variant="ghost"
          endIcon={<ArrowRight width={20} height={20} />}
          className="w-full justify-center capitalize font-bold font-inter md:w-auto md:justify-end"
          size="small"
          onClick={handleNext}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
