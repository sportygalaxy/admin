import { FC, useMemo, useState } from "react";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Edit01, RefreshCcw01, SearchLg } from "@untitled-ui/icons-react";
import LoadingContent from "@/common/LoadingContent/LoadingContent";
import TableSkeletonLoader from "@/common/Table/TableSkeletonLoader";
import TableError from "@/common/Table/TableError";
import TableEmpty from "@/common/Table/TableEmpty";
import { ApiSizeStoreSlice } from "@/api/ApiSizeStoreSlice";
import SizeDeleteButton from "./SizeDeleteButton";
import { SizeItem } from "./SizeTypes";

type SizeTableProps = {
  onEdit: (size: SizeItem) => void;
};

const SizeTable: FC<SizeTableProps> = ({ onEdit }) => {
  const { data, isLoading, isError, refetch } =
    ApiSizeStoreSlice.useGetSizesQuery();
  const [searchTerm, setSearchTerm] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sizes: SizeItem[] = data?.data || [];

  const filteredSizes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return sizes;
    return sizes.filter((size) =>
      size.name?.toLowerCase().includes(term.toLowerCase())
    );
  }, [sizes, searchTerm]);

  return (
    <>
      <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
        <TextField
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search size"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchLg width={20} height={20} />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          className="MuiTextFieldOutlined--plain"
        />

        <Button
          variant="text"
          startIcon={<RefreshCcw01 width={18} height={18} />}
          className="text-xs font-semibold capitalize font-inter"
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </div>

      <LoadingContent
        loading={isLoading}
        error={isError}
        onReload={refetch}
        loadingContent={<TableSkeletonLoader />}
        errorContent={<TableError onReload={() => refetch()} />}
        emptyContent={<TableEmpty />}
        data={filteredSizes}
        className="mt-6"
      >
        <div className="table-mobile-scroll rounded-xl border border-[#EAECF0] bg-white shadow-none">
          <table className="w-full text-left">
            <thead className="bg-[#F2F4F7] text-[#667085] text-xs border-b-1 border-[#F9FAFB]">
              <tr>
                <th className="w-12 p-6 py-3 font-medium">
                  <Typography
                    color="grey.700"
                    className="text-sm font-medium capitalize font-inter"
                  >
                    #
                  </Typography>
                </th>
                <th className="p-6 py-3 font-medium">
                  <Typography
                    color="grey.700"
                    className="text-sm font-medium capitalize font-inter"
                  >
                    Name
                  </Typography>
                </th>
                <th className="p-6 py-3 font-medium">
                  <Typography
                    color="grey.700"
                    className="text-sm font-medium capitalize font-inter"
                  >
                    ID
                  </Typography>
                </th>
                <th className="p-6 py-3 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="bg-[#FFF] text-[#667085] text-sm">
              {filteredSizes?.map((size, index) => (
                <tr
                  key={size.id}
                  className="py-5 border-b-1 border-[#EAECF0] hover:bg-[#F3F4F7]"
                >
                  <td className="p-6 py-4 align-top">{index + 1}</td>
                  <td className="p-6 py-4 font-semibold text-black">
                    <Typography
                      color="grey.700"
                      className="text-sm font-medium capitalize font-inter"
                    >
                      {size.name}
                    </Typography>
                  </td>
                  <td className="p-6 py-4 text-xs text-primary-main">
                    <Typography
                      color="grey.400"
                      className="text-xs font-medium capitalize font-inter"
                    >
                      {size.id}
                    </Typography>
                  </td>
                  <td className="p-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <IconButton
                        aria-label="Edit size"
                        onClick={() => onEdit(size)}
                        size="small"
                      >
                        <Edit01 width={18} height={18} />
                      </IconButton>
                      <SizeDeleteButton size={size} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LoadingContent>
    </>
  );
};

export default SizeTable;
