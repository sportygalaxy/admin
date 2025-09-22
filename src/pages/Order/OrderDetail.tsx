import { ApiOrderStoreSlice } from "@/api/ApiOrderStoreSlice";
import BackButton from "@/common/BackButton";
import { formatCurrency } from "@/utils/currencyUtils";
import { Chip, Typography } from "@mui/material";
import { FC } from "react";
import { useParams } from "react-router-dom";

import SportygalaxyLoadingIndicator from "@/common/Loading/SportygalaxyLoadingIndicator";
import OrderProductList from "./OrderProductList";
import OrderStatus from "@/common/OrderStatus";
import OrderStatusAssignModal from "./OrderStatusAssignModal";
import WatermarkOverlay from "@/common/WatermarkOverlay";
import { ORDER_STATUS } from "@/constants/enums";
import OrderDeleteButton from "./OrderDeleteButton";
import LoadingContent from "@/common/LoadingContent/LoadingContent";
import { objectToArray } from "@/utils/ObjectUtils";
import ProductDynamicKeyValueTio from "../Product/components/ProductDynamicKeyValueTio";

interface OrderDetailProps {}
const OrderDetail: FC<OrderDetailProps> = () => {
  const { id } = useParams<{ id: string }>() as { id: string };
  const getOrderInfoQuery = ApiOrderStoreSlice.useGetOrderInfoQuery(
    {
      id,
    },
    { skip: !id }
  );
  const orderInfoResponse = getOrderInfoQuery?.data?.data;

  const user = orderInfoResponse?.user || orderInfoResponse?.offlineUser || {};
  const isOfflineUser = !orderInfoResponse?.user;
  const isHasExtraInfo =
    orderInfoResponse?.user && orderInfoResponse?.offlineUser;
  const userName = `${user?.firstName || "N/A"} ${user?.lastName || "N/A"}`;
  const userEmail = user?.email || "N/A";
  const userAddress = user?.address || "N/A";
  const userPhone = user?.phone || "N/A";

  const offlineUserAddress = orderInfoResponse?.offlineUser?.address || "N/A";
  const offlineUserPhone = orderInfoResponse?.offlineUser?.phone || "N/A";

  const variant = orderInfoResponse?.variant || null;
  const total = orderInfoResponse?.total || 0;
  const amountToPay = orderInfoResponse?.amountToPay || 0;
  const status = orderInfoResponse?.status || "";
  const paymentOption = orderInfoResponse?.paymentOption || "";

  const isDeleted = orderInfoResponse?.isDeleted ?? false;
  const isCanceled =
    orderInfoResponse?.status === ORDER_STATUS.CANCELED || false;
  const isDisabled = isDeleted || isCanceled;

  // Generate dynamic text based on the flags
  const dynamicText = [
    isDeleted ? "ORDER DELETED" : null,
    isCanceled ? "ORDER CANCELED" : null,
  ]
    .filter(Boolean) // Remove null values
    .join(" and "); // Combine the text dynamically

  const userStatus = (): JSX.Element => {
    return (
      <>
        {isOfflineUser ? (
          <Chip
            color="error"
            className="text-xs font-medium font-inter"
            icon={<span className="w-2 h-2 rounded-full bg-[#F04438]"></span>}
            label="Offline Customer"
          />
        ) : (
          <Chip
            color="success"
            icon={<span className="w-2 h-2 rounded-full bg-[#1BA879]"></span>}
            label="Online Customer"
          />
        )}
      </>
    );
  };

  return (
    <>
      <WatermarkOverlay isVisible={isDisabled} text={dynamicText} />

      <div className="container-wrapper py-[30px]">
        <div className="flex items-center justify-between">
          <div>
            <BackButton />
          </div>
        </div>

        <div className="flex items-center justify-between mt-7">
          <Typography
            color="grey.900"
            className="text-4xl font-bold font-crimson"
          >
            Order Details
          </Typography>
        </div>

        <LoadingContent
          loading={getOrderInfoQuery.isLoading}
          error={getOrderInfoQuery.isError}
          onReload={getOrderInfoQuery.refetch}
          loadingContent={<SportygalaxyLoadingIndicator />}
          // errorContent={<TableError onReload={() => refetch()} />}
          // emptyContent={</>}
          data={objectToArray(orderInfoResponse)}
        >
          <div className="mt-10 space-y-10">
            <OrderProductList items={orderInfoResponse?.items} />

            {variant && (
              <ProductDynamicKeyValueTio
                title="Variant"
                data={[orderInfoResponse?.variant]}
              />
            )}
            <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
              <div className="mt-8">
                <p className="font-bold text-black font-jost text-mobile-2xl md:text-2xl">
                  Status
                </p>

                <div className="mt-2 space-y-6">
                  {status && (
                    <div className="space-y-3">
                      <p className="flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Status: <OrderStatus status={status} />
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <p className="font-bold text-black font-jost text-mobile-2xl md:text-2xl">
                  Payments
                </p>

                {variant ? (
                  <div className="mt-2 space-y-6">
                    <div className="space-y-3">
                      <p className="flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Option: {paymentOption}
                      </p>

                      <p className="flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Total Cost: {formatCurrency(variant?.prices || 0)}
                      </p>

                      {paymentOption === "FULL" ? (
                        <>
                          <p className="flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                            Amount Paid: {formatCurrency(variant?.prices || 0)}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                            Amount Paid:{" "}
                            {formatCurrency(variant?.amountToPay) || 0}
                          </p>
                        </>
                      )}

                      <p className="flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Amount Remaining:{" "}
                        {paymentOption === "FULL"
                          ? "NIL"
                          : formatCurrency(
                              variant?.prices - variant?.amountToPay
                            ) || 0}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 space-y-6">
                    <div className="space-y-3">
                      <p className="flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Option: {paymentOption}
                      </p>

                      <p className="flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Total Cost: {formatCurrency(total || 0)}
                      </p>

                      {paymentOption === "FULL" ? (
                        <>
                          <p className="flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                            Amount Paid: {formatCurrency(total || 0)}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                            Amount Paid:
                            {paymentOption === "FULL"
                              ? "NIL"
                              : formatCurrency(total - amountToPay) || 0}
                          </p>
                        </>
                      )}

                      <p className="flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Amount Remaining: {formatCurrency(amountToPay) || 0}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <p className="font-bold text-black font-jost text-mobile-2xl md:text-2xl">
                  Delivery Information {userStatus()}
                </p>

                <div className="mt-2 space-y-6">
                  {user && (
                    <div className="space-y-3">
                      <p className="flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Name: {userName}
                      </p>
                      <p className="flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Email: {userEmail}
                      </p>
                      <p className="flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Address: {userAddress}
                      </p>
                      <p className="flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Phone Number: {userPhone}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <p className="font-bold text-black font-jost text-mobile-2xl md:text-2xl">
                  Additional Information
                </p>

                <div className="mt-2 space-y-6">
                  {isHasExtraInfo && (
                    <div className="space-y-3">
                      <p className="flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Address: {offlineUserAddress}
                      </p>
                      <p className="flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl">
                        Phone Number: {offlineUserPhone}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-10 space-x-3">
              <OrderStatusAssignModal
                id={id}
                status={status}
                buttonText="Update Order Status"
              />

              <OrderDeleteButton disable={isDisabled} orderId={id} />
            </div>
          </div>
        </LoadingContent>
      </div>
    </>
  );
};

export default OrderDetail;
