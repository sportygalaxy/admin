import { Navigate, Outlet, matchPath, useLocation } from "react-router-dom";
import { routeEnum } from "@/constants/RouteConstants";
import AppProtectedSideMenu from "@/AppProtectedSideMenu";
import AppProtectedHeader from "@/AppProtectedHeader";
import { Box } from "@mui/material";
import theme from "../../../../mui.config";
import useAuthUser from "@/hooks/useAuthUser";
import { isAdminRole } from "@/constants/roles";

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

  const isRoot = matchPath(
    {
      path: location.pathname,
    },
    "/"
  );

  if (isRoot) {
    return <Navigate to={routeEnum.DASHBOARD} replace />;
  }

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-12 min-h-screen">
        <div className="col-span-4 lg:col-span-3 3xl:col-span-2 resize-x overflow-auto min-w-[150px] max-w-full">
          <AppProtectedSideMenu />
        </div>

        <div className="col-span-8 lg:col-span-9 3xl:col-span-10 h-[100svh] overflow-y-scroll">
          <AppProtectedHeader />
          <Box sx={{ backgroundColor: theme.palette.grey[50] }}>
            <Outlet />
          </Box>
        </div>
      </div>
    </div>
  );
}

export { PublicRoutesLayout, ProtectRoutesLayout };
