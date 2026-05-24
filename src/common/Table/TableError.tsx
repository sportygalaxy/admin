import { IconButton, Tooltip, Typography } from "@mui/material";
import { RefreshCcw01 } from "@untitled-ui/icons-react";
import { FC } from "react";

interface TableErrorProps {
  onReload?: () => void;
  title?: string;
  description?: string;
}
const TableError: FC<TableErrorProps> = ({
  onReload,
  title = "Something went wrong",
  description = "We're quite sorry about this!",
}) => {
  return (
    <div className="mt-10">
      <div className="table-mobile-scroll">
        <table className="w-full text-left">
          <thead className="bg-[#F2F4F7] text-[#667085] text-xs border-b-1 border-[#F9FAFB]">
            <tr>
              <th className="py-3 font-medium p-6">
                <div className="w-20 h-4 bg-gray-200 animate-pulse rounded"></div>
              </th>
              <th className="py-3 font-medium p-6">
                <div className="w-20 h-4 bg-gray-200 animate-pulse rounded"></div>
              </th>
              <th className="py-3 font-medium p-6">
                <div className="w-20 h-4 bg-gray-200 animate-pulse rounded"></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#FFF] text-[#667085] text-sm"></tbody>
        </table>
      </div>

      <div className="w-full h-[20vh] flex items-center justify-center bg-[#fdf9f9] flex-col gap-2">
        <svg
          width={28}
          height={28}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
            stroke="#D92D20"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div>
          <Typography
            variant="body1"
            className="mt-4 text-center font-gelica"
            fontWeight={600}
          >
            {title}
          </Typography>
          <Typography
            className="mt-2 text-center"
            variant="body2"
            style={{ color: "#6C6C6C" }}
          >
            {description}
          </Typography>
        </div>

        <div>
          <Tooltip title="Refresh">
            <IconButton size="large" onClick={onReload}>
              <RefreshCcw01 />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default TableError;
