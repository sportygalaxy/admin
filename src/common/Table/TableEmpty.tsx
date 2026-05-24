import { Chip } from "@mui/material";
import { FC } from "react";

const TableEmpty: FC = () => {
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

      <div className="w-full h-[20vh] flex items-center justify-center bg-[#fff]">
        <Chip variant="outlined" color="default" label="No record found!" />
      </div>
    </div>
  );
};

export default TableEmpty;
