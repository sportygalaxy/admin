import { TextField, InputAdornment, IconButton } from "@mui/material";
import { SearchLg } from "@untitled-ui/icons-react";
import { FC } from "react";

const Search: FC<{
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}> = ({ globalFilter, setGlobalFilter }) => {
  return (
    <TextField
      value={globalFilter}
      onChange={(e) => setGlobalFilter(e.target.value)}
      className="MuiTextFieldOutlined--plain !w-full md:!max-w-[480px] md:mr-auto"
      placeholder="Search by Name, ID and others..."
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="end">
            <IconButton>
              <SearchLg className="text-[#101828]" />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default Search;
