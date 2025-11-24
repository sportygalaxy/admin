export const routeEnum = {
  // Public
  HOME: "/",
  LOGIN: "/login",

  USERS: "/users",

  PRODUCTS: "/products/product-list",
  PRODUCTS_CREATE: "/products/create",
  PRODUCTS_UPDATE: "/products/:id/update",
  PRODUCT_DETAILS: "/products/:id",
  PRODUCT_COLORS: "/products/color-list",

  REVIEWS: "/reviews",

  ORDERS: "/orders",
  ORDERS_CREATE: "/orders/create",
  ORDERS_UPDATE: "/orders/:id/update",
  ORDER_DETAILS: "/orders/:id",

  // Client
  USERS_CLIENTS: "/users/client-list",
  USERS_CLIENT_DETAILS: "/users/client-profile/:id",

  // Employee
  USERS_EMPLOYEES: "/users/employee-list",
  USERS_EMPLOYEE_DETAILS: "/users/employee-profile/:id",
  USERS_EMPLOYEE_APPLICATION_DETAILS: "/user/employee-application/:id",

  CLIENT_TRANSACTIONS: "/client/:id/transactions",
  CLIENT_TRANSACTION_DETAILS: "/client/:client/transactions/:id",

  // Protected
  DASHBOARD: "/dashboard",
  TRANSACTIONS: "/transactions",

  SETTINGS: "/settings",
};
