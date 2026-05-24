import { FC } from "react";

const TableSkeletonLoader: FC = () => {
  return (
    <div className="table-mobile-scroll mt-10">
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
        <tbody className="bg-[#FFF] text-[#667085] text-sm">
          {[...Array(10)].map((_, index) => (
            <tr
              key={index}
              className="py-5 border-b-1 border-[#EAECF0] hover:bg-[#F3F4F7]"
            >
              <td className="py-4 p-6">
                <div className="w-full h-6 bg-gray-200 animate-pulse rounded"></div>
              </td>
              <td className="py-4 p-6">
                <div className="w-full h-6 bg-gray-200 animate-pulse rounded"></div>
              </td>
              <td className="py-4 p-6">
                <div className="w-full h-6 bg-gray-200 animate-pulse rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeletonLoader;
