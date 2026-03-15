import { sportygalaxyAdminApi } from "@/store/storeQuerySlice";
import {
  type GetUserResponse,
  type GetMeResponse,
  type GetUserInfoRequest,
  type GetUserInfoResponse,
} from "@/types/user";
import { RtkqTagEnum } from "@/constants/RtkqTagEnums";

export const ApiUserStoreSlice = sportygalaxyAdminApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<
      any,
      {
        pageIndex: number;
        pageSize: number;
        sorting: any;
        globalFilter: string | null;
        roles?: string[];
        isDeleted?: boolean;
        isRequestDelete?: boolean;
      }
    >({
      query: ({
        pageIndex,
        pageSize,
        sorting,
        globalFilter,
        roles,
        isDeleted,
        isRequestDelete,
      }) => {
        const params = new URLSearchParams();

        params.set("page", (pageIndex + 1).toString());
        params.set("limit", pageSize.toString());

        if (globalFilter) {
          params.set("q", globalFilter);
        }

        if (roles?.length) {
          params.set("roles", roles.join(","));
        }

        if (isDeleted) {
          params.set("isDeleted", String(isDeleted));
        }

        if (isRequestDelete) {
          params.set("isRequestDelete", String(isRequestDelete));
        }

        if (sorting?.length) {
          const { id, desc } = sorting[0];
          params.set("sort", `${id},${desc ? "desc" : "asc"}`);
        }

        return {
          url: `/users?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [RtkqTagEnum.USERS, RtkqTagEnum.ADMINS],
    }),
    getMe: builder.query<GetMeResponse, void>({
      query: () => ({
        url: "/api/v2/users/info",
        method: "GET",
      }),
      providesTags: [RtkqTagEnum.USERS, RtkqTagEnum.AUTH],
    }),
    getUserInfo: builder.query<GetUserInfoResponse, GetUserInfoRequest>({
      query: ({ id }: GetUserInfoRequest) => ({
        url: `/auth/users/${id}`,
        method: "GET",
      }),
      providesTags: [RtkqTagEnum.USERS],
    }),
    getUser: builder.query<GetUserResponse, { id: string | undefined }>({
      query: ({ id }) => ({
        url: `/users/${id}`,
      }),
      providesTags: [RtkqTagEnum.USERS, RtkqTagEnum.ADMINS],
    }),
    updateUserRole: builder.mutation<any, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        data: { role },
      }),
      invalidatesTags: [RtkqTagEnum.USERS, RtkqTagEnum.ADMINS],
    }),
  }),
  overrideExisting: false,
});
