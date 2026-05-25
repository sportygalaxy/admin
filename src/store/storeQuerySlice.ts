import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "@/utils/axios-base-request";
import { SportyGalaxyAdminHttp } from "@/configs/HttpConfig";
import { LoginRequest, LoginResponse } from "@/types/auth";

import { RtkqTagEnum } from "@/constants/RtkqTagEnums";

export const sportygalaxyAdminApi = createApi({
  reducerPath: "sportygalaxyAdmin",
  baseQuery: axiosBaseQuery({}, SportyGalaxyAdminHttp),
  tagTypes: [RtkqTagEnum.AUTH, RtkqTagEnum.USERS],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: ({ ...data }: LoginRequest) => ({
        url: "/auth/admin/login",
        data,
        method: "POST",
      }),
      onQueryStarted: async ({ queryFulfilled }: any) => {
        try {
          await queryFulfilled;
        } catch (error) {}
      },
      invalidatesTags: [RtkqTagEnum.AUTH],
    }),
    logout: builder.mutation({
      query: (data: any) => ({
        url: "/auth/logout",
        data,
      }),
    }),
  }),
});

[sportygalaxyAdminApi].forEach((api) => {
  api.enhanceEndpoints({ addTagTypes: Object.values(RtkqTagEnum) });
});
