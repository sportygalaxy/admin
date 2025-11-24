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
import { ApiColorStoreSlice } from "@/api/ApiColorStoreSlice";
import ColorDeleteButton from "./ColorDeleteButton";
import { ColorItem } from "./ColorTypes";

type ColorTableProps = {
  onEdit: (color: ColorItem) => void;
};

const ColorTable: FC<ColorTableProps> = ({ onEdit }) => {
  const { data, isLoading, isError, refetch } =
    ApiColorStoreSlice.useGetColorsQuery();
  const [searchTerm, setSearchTerm] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const colors: ColorItem[] = data?.data || [];

  const filteredColors = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return colors;
    return colors.filter((color) =>
      color.name?.toLowerCase().includes(term.toLowerCase())
    );
  }, [colors, searchTerm]);

  return (
    <>
      <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
        <TextField
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search color"
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
        data={filteredColors}
        className="mt-6"
      >
        <div className="bg-white rounded-xl shadow-none border border-[#EAECF0] overflow-hidden">
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
                <th className="w-20 p-6 py-3 font-medium">
                  <Typography
                    color="grey.700"
                    className="text-sm font-medium capitalize font-inter"
                  >
                    Preview
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
              {filteredColors?.map((color, index) => (
                <tr
                  key={color.id}
                  className="py-5 border-b-1 border-[#EAECF0] hover:bg-[#F3F4F7]"
                >
                  <td className="p-6 py-4 align-top">{index + 1}</td>
                  <td className="p-6 py-4">
                    <div
                      className="w-9 h-9 rounded-full border border-[#EAECF0] shadow-inner"
                      style={{
                        backgroundColor: color.name || "#EAECF0",
                      }}
                    />
                  </td>
                  <td className="p-6 py-4 font-semibold text-black">
                    <Typography
                      color="grey.700"
                      className="text-sm font-medium capitalize font-inter"
                    >
                      {color.name}
                    </Typography>
                  </td>
                  <td className="p-6 py-4 text-xs text-primary-main">
                    <Typography
                      color="grey.400"
                      className="text-xs font-medium capitalize font-inter"
                    >
                      {color.id}
                    </Typography>
                  </td>
                  <td className="p-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <IconButton
                        aria-label="Edit color"
                        onClick={() => onEdit(color)}
                        size="small"
                      >
                        <Edit01 width={18} height={18} />
                      </IconButton>
                      <ColorDeleteButton color={color} />
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

export default ColorTable;
