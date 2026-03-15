import { type ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { routeEnum } from "@/constants/RouteConstants";
import useAuthUser from "@/hooks/useAuthUser";
import { isAdminRole, type UserRole } from "@/constants/roles";

interface AuthGuardProps {
  component: ReactElement;
  route?: any;
}

// PS: This can be extended as we see fit
function AuthGuard({ component, route }: AuthGuardProps): ReactElement {
  const location = useLocation();

  const user = useAuthUser();
  const isAuthorized = !!user?.token && isAdminRole(user?.role);

  if (!isAuthorized) {
    return (
      <Navigate
        state={{ prevLocation: location }}
        to={routeEnum.LOGIN}
        replace
      />
    );
  }

  if (
    route?.allowedRoles?.length &&
    !route.allowedRoles.includes(user.role as UserRole)
  ) {
    return <Navigate to={routeEnum.DASHBOARD} replace />;
  }

  return component;
}

export default AuthGuard;
