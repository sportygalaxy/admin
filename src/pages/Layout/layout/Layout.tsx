import { Navigate, Outlet, matchPath, useLocation } from "react-router-dom";
import { routeEnum } from "@/constants/RouteConstants";
import AppProtectedSideMenu from "@/AppProtectedSideMenu";
import AppProtectedHeader from "@/AppProtectedHeader";
import { Box, Drawer } from "@mui/material";
import theme from "../../../../mui.config";
import useAuthUser from "@/hooks/useAuthUser";
import { isAdminRole } from "@/constants/roles";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSideMenuAction } from "@/store/storeSlice";

function PublicRoutesLayout() {
  const location = useLocation();
  const user = useAuthUser();

  const isRoot = matchPath(
    {
      path: location.pathname,
    },
    "/"
  );

  if (user && isAdminRole(user?.role) && isRoot) {
    return <Navigate to={routeEnum.DASHBOARD} replace />;
  }

  if (user && isAdminRole(user?.role)) {
    return (
      <Navigate
        state={{ prevLocation: location }}
        to={routeEnum.DASHBOARD}
        replace
      />
    );
  }

  return (
    <>
      <Outlet />
    </>
  );
}

function ProtectRoutesLayout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isMobileNavOpen = useSelector(
    (state: any) => state?.global?.isSideMenu
  );

  const isRoot = matchPath(
    {
      path: location.pathname,
    },
    "/"
  );

  useEffect(() => {
    dispatch(toggleSideMenuAction(false));
  }, [dispatch, location.key]);

  if (isRoot) {
    return <Navigate to={routeEnum.DASHBOARD} replace />;
  }

  return (
    <div className="min-h-screen bg-[#F2F4F7]">
      <div className="flex min-h-screen">
        <aside className="hidden shrink-0 border-r border-[#EAECF0] bg-[#F2F4F7] lg:block lg:w-[300px] xl:w-[320px]">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <AppProtectedSideMenu />
          </div>
        </aside>

        {isMobileNavOpen ? (
          <Drawer
            variant="temporary"
            open={isMobileNavOpen}
            onClose={() => dispatch(toggleSideMenuAction(false))}
            PaperProps={{
              sx: {
                width: "min(88vw, 320px)",
                backgroundColor: theme.palette.grey[100],
              },
            }}
            sx={{
              display: {
                xs: "block",
                lg: "none",
              },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
              },
            }}
          >
            <AppProtectedSideMenu
              onNavigate={() => dispatch(toggleSideMenuAction(false))}
            />
          </Drawer>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-30 border-b border-[#EAECF0] bg-[#F2F4F7]">
            <AppProtectedHeader />
          </div>
          <Box
            sx={{ backgroundColor: theme.palette.grey[50] }}
            className="min-h-[calc(100vh-88px)] md:min-h-[calc(100vh-104px)]"
          >
            <Outlet />
          </Box>
        </div>
      </div>
    </div>
  );
}

export { PublicRoutesLayout, ProtectRoutesLayout };
