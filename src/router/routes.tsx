import { ReactElement, lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";

import AuthGuard from "./guard";

import ErrorBoundaryRoot from "@/common/ErrorBoundary/ErrorBoundaryRoot";
import {
  ProtectRoutesLayout,
  PublicRoutesLayout,
} from "@/pages/Layout/layout/Layout";
import { routeEnum } from "@/constants/RouteConstants";
import Review from "@/pages/Review/Review";

const Home = lazy(() => import("@/pages/Home/Home"));

const Product = lazy(() => import("@/pages/Product/Product"));
const ProductCreate = lazy(() => import("@/pages/Product/ProductCreate"));
const ProductUpdate = lazy(() => import("@/pages/Product/ProductUpdate"));
const ProductDetail = lazy(() => import("@/pages/Product/ProductDetail"));
const ProductColor = lazy(() => import("@/pages/Color/Color"));
const ProductSize = lazy(() => import("@/pages/Size/Size"));

const Order = lazy(() => import("@/pages/Order/Order"));
const OrderDetail = lazy(() => import("@/pages/Order/OrderDetail"));

const Client = lazy(() => import("@/pages/Client/Client"));
const ClientProfile = lazy(() => import("@/pages/ClientProfile/ClientProfile"));

const Employee = lazy(() => import("@/pages/Employee/Employee"));
const EmployeeProfile = lazy(
  () => import("@/pages/EmployeeProfile/EmployeeProfile")
);

const Transaction = lazy(() => import("@/pages/Transaction/Transaction"));

const AuthLogin = lazy(() => import("@/pages/Auth/AuthLogin"));

type ExtendedRouteObject = RouteObject & {
  guarded?: boolean;
};

export const PublicRoutes: ExtendedRouteObject[] = [
  {
    path: routeEnum.HOME,
    element: <PublicRoutesLayout />,
    errorElement: <ErrorBoundaryRoot />,
    children: [
      {
        path: routeEnum.HOME,
        element: <AuthLogin />,
        errorElement: <ErrorBoundaryRoot />,
      },
      {
        path: routeEnum.LOGIN,
        element: <AuthLogin />,
        errorElement: <ErrorBoundaryRoot />,
      },
    ],
  },
];

export const ProtectedRoutes: ExtendedRouteObject[] = [
  {
    path: routeEnum.HOME,
    hasErrorBoundary: true,
    element: <ProtectRoutesLayout />,
    errorElement: <ErrorBoundaryRoot />,
    guarded: true,
    children: [
      {
        path: routeEnum.HOME,
        element: <Home />,
        errorElement: <ErrorBoundaryRoot />,
      },
      {
        path: routeEnum.DASHBOARD,
        element: <Home />,
        errorElement: <ErrorBoundaryRoot />,
      },
      {
        path: routeEnum.PRODUCTS,
        element: <Product />,
        errorElement: <ErrorBoundaryRoot />,
      },
      {
        path: routeEnum.PRODUCTS_CREATE,
        element: <ProductCreate />,
        errorElement: <ErrorBoundaryRoot />,
      },
      {
        path: routeEnum.PRODUCTS_UPDATE,
        element: <ProductUpdate />,
        errorElement: <ErrorBoundaryRoot />,
      },
      {
        path: routeEnum.PRODUCT_DETAILS,
        element: <ProductDetail />,
        errorElement: <ErrorBoundaryRoot />,
      },
      {
        path: routeEnum.PRODUCT_COLORS,
        element: <ProductColor />,
        errorElement: <ErrorBoundaryRoot />,
      },
      {
        path: routeEnum.PRODUCT_SIZES,
        element: <ProductSize />,
        errorElement: <ErrorBoundaryRoot />,
      },
      {
        path: routeEnum.REVIEWS,
        element: <Review />,
        errorElement: <ErrorBoundaryRoot />,
      },
      {
        path: routeEnum.ORDERS,
        element: <Order />,
        errorElement: <ErrorBoundaryRoot />,
      },
      {
        path: routeEnum.ORDER_DETAILS,
        element: <OrderDetail />,
        errorElement: <ErrorBoundaryRoot />,
      },
      {
        path: routeEnum.USERS_CLIENTS,
        element: <Client />,
        errorElement: <ErrorBoundaryRoot />,
      },
      {
        path: routeEnum.USERS_CLIENT_DETAILS,
        element: <ClientProfile />,
        errorElement: <ErrorBoundaryRoot />,
      },

      {
        path: routeEnum.USERS_EMPLOYEES,
        element: <Employee />,
        errorElement: <ErrorBoundaryRoot />,
      },
      {
        path: routeEnum.USERS_EMPLOYEE_DETAILS,
        element: <EmployeeProfile />,
        errorElement: <ErrorBoundaryRoot />,
      },
      {
        path: routeEnum.TRANSACTIONS,
        element: <Transaction />,
        errorElement: <ErrorBoundaryRoot />,
      },
    ],
  },
];

const allRoutes: ExtendedRouteObject[] = [
  ...PublicRoutes,
  ...ProtectedRoutes,
  {
    path: "*",
    element: <Navigate to={routeEnum.DASHBOARD} replace />,
  },
];

const appRoutes = allRoutes.map((route) => {
  if (route?.guarded && route?.element) {
    route.element = (
      <AuthGuard route={route} component={route.element as ReactElement} />
    );
  }

  return route;
});

export default appRoutes;
