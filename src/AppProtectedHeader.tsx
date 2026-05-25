import { FC } from "react";
import MenuDropdown from "./common/Menu";
import useFirstFollowUpPath from "./hooks/useFirstFollowUpPath";
import { IconButton } from "@mui/material";
import { Menu01 } from "@untitled-ui/icons-react";
import { useDispatch } from "react-redux";
import { toggleSideMenuAction } from "./store/storeSlice";

interface AppProtectedHeaderProps {}
const AppProtectedHeader: FC<AppProtectedHeaderProps> = () => {
  const firstFollowUpPath = useFirstFollowUpPath();
  const dispatch = useDispatch();
  return (
    <div className="container-wrapper flex items-center justify-between gap-3 bg-[#F2F4F7] pb-4 pt-5 md:gap-6 md:pb-[19px] md:pt-[30px]">
      <div className="flex min-w-0 items-center gap-3">
        <IconButton
          aria-label="Open navigation menu"
          onClick={() => dispatch(toggleSideMenuAction(true))}
          className="!border !border-[#D0D5DD] !bg-white lg:!hidden"
          size="small"
        >
          <Menu01 width={20} height={20} />
        </IconButton>
        <p className="mr-auto line-clamp-1 text-2xl font-bold capitalize text-black font-crimson md:text-3xl">
          {firstFollowUpPath ?? ""}
        </p>
      </div>
      <div className="flex shrink-0 items-center justify-end">
        <MenuDropdown />
      </div>
    </div>
  );
};

export default AppProtectedHeader;
