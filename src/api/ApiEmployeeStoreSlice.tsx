import { sportygalaxyAdminApi } from "@/store/storeQuerySlice";
import { RtkqTagEnum } from "@/constants/RtkqTagEnums";

export const ApiEmployeeStoreSlice = sportygalaxyAdminApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<
      any,
      {
        pageIndex: number;
        pageSize: number;
        sorting: any;
        globalFilter: string | null;
        isDeleted?: boolean;
        isRequestDelete?: boolean;
        employeeStatus?: string;
      }
    >({
      query: ({
        pageIndex,
        pageSize,
        sorting,
        globalFilter,
        isDeleted,
        isRequestDelete,
        employeeStatus,
      }) => {
        let params = new URLSearchParams({
          page: (pageIndex + 1).toString(), // Ensure 1-based index
          limit: pageSize.toString(),
          roles: "SUPER_ADMIN,ADMIN,STAFF",
          ...(employeeStatus && { employeeStatus }),
          ...(globalFilter && { search: globalFilter }),
          ...(isDeleted && { isDeleted }),
          ...(isRequestDelete && { isRequestDelete }),
          ...(sorting?.length && {
            sort: `${sorting[0].id},${sorting[0].desc ? "desc" : "asc"}`,
          }),
        });

        // console.log("params", params.toString());

        return {
          url: `/users?${params.toString()}`,
        };
      },
      providesTags: [RtkqTagEnum.USERS, RtkqTagEnum.EMPLOYEES],
    }),
    getEmployeeInfo: builder.query<any, any>({
      query: ({ id }: any) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: [RtkqTagEnum.USERS, RtkqTagEnum.EMPLOYEES],
    }),
  }),
  overrideExisting: false,
});
