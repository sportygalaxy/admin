import { ApiClientStoreSlice } from "@/api/ApiClientStoreSlice";
import BackButton from "@/common/BackButton";
import LoadingContent from "@/common/LoadingContent/LoadingContent";
import { FC } from "react";
import { useParams } from "react-router-dom";
import ErrorContent from "@/common/LoadingContent/ErrorContent";
import EmptyContentCard from "@/common/LoadingContent/EmptyContentCard";
import { objectToArray } from "@/utils/ObjectUtils";
import { Typography } from "@mui/material";
import ClientProfileDetailCard from "./ClientProfileDetailCard";
import ClientProfileDetailCardSkeleton from "./ClientProfileDetailCardSkeleton";

interface ClientProfileProps {}
const ClientProfile: FC<ClientProfileProps> = () => {
  const { id } = useParams<{ id: string }>() as { id: string };

  const getUserQuery = ApiClientStoreSlice.useGetClientInfoQuery(
    {
      id,
    },
    { skip: !id }
  );

  return (
    <div className="container-wrapper py-[30px] h-[calc(100vh-118.5px)]">
      <div className="space-y-5">
        <BackButton />
        <div>
          <Typography
            color="grey.900"
            className="font-bold text-3xl font-crimson"
          >
            User Profile
          </Typography>
          <Typography color="grey.600" className="mt-1 text-sm font-inter">
            Full account overview, status, and system details for this user.
          </Typography>
        </div>
      </div>

      <div className="mt-7">
        <LoadingContent
          loading={getUserQuery.isLoading}
          error={getUserQuery.isError}
          onReload={getUserQuery.refetch}
          loadingContent={<ClientProfileDetailCardSkeleton />}
          errorContent={<ErrorContent onReload={() => getUserQuery.refetch()} />}
          emptyContent={<EmptyContentCard />}
          data={objectToArray(getUserQuery?.data?.data)}
        >
          <ClientProfileDetailCard
            {...{
              id: getUserQuery?.data?.data?.id || "",
              firstName: getUserQuery?.data?.data?.firstName || "",
              lastName: getUserQuery?.data?.data?.lastName || "",
              email: getUserQuery?.data?.data?.email || "",
              role: getUserQuery?.data?.data?.role || "USER",
              address: getUserQuery?.data?.data?.address || "",
              avatar: getUserQuery?.data?.data?.avatar || "",
              createdAt: getUserQuery?.data?.data?.createdAt || "",
              updatedAt: getUserQuery?.data?.data?.updatedAt || "",
              deletedAt: getUserQuery?.data?.data?.deletedAt || "",
              phone: getUserQuery?.data?.data?.phone || "",
              bio: getUserQuery?.data?.data?.bio || "",
              googleId: getUserQuery?.data?.data?.googleId || "",
              isVerified: Boolean(getUserQuery?.data?.data?.isVerified),
              isDeleted: Boolean(getUserQuery?.data?.data?.isDeleted),
            }}
          />
        </LoadingContent>
      </div>
    </div>
  );
};

export default ClientProfile;
