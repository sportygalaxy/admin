import { ApiOrderStoreSlice } from "@/api/ApiOrderStoreSlice";
import BackButton from "@/common/BackButton";
import { formatCurrency } from "@/utils/currencyUtils";
import { Chip, Typography } from "@mui/material";
import { FC, useMemo } from "react";
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
import OrderDynamicKeyValue from "./OrderDynamicKeyValue";

interface OrderDetailProps {}
const OrderDetail: FC<OrderDetailProps> = () => {
  const { id } = useParams<{ id: string }>() as { id: string };
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = ApiOrderStoreSlice.useGetOrderInfoQuery({ id }, { skip: !id });
  const order = data?.data;

  const {
    user: onlineUser,
    offlineUser,
    variant,
    total = 0,
    amountToPay = 0,
    amountPaid = 0,
    shippingFee = 0,
    shippingState = 0,
    status = "",
    paymentOption = "",
    items,
  } = order || {};

  const user = onlineUser || offlineUser || {};
  const isOfflineUser = !onlineUser;
  const isHasExtraInfo = Boolean(onlineUser && offlineUser);

  const userName = `${user?.firstName || "N/A"} ${user?.lastName || "N/A"}`;
  const userEmail = user?.email || "N/A";
  const userAddress = user?.address || "N/A";
  const userPhone = user?.phone || "N/A";

  const offlineUserAddress = offlineUser?.address || "N/A";
  const offlineUserPhone = offlineUser?.phone || "N/A";

  const freeGift = onlineUser?.freeGift || null;

  const isDeleted = order?.isDeleted ?? false;
  const isCanceled = status === ORDER_STATUS.CANCELED || false;
  const isDisabled = isDeleted || isCanceled;

  const dynamicText = useMemo(
    () =>
      [isDeleted ? "ORDER DELETED" : null, isCanceled ? "ORDER CANCELED" : null]
        .filter(Boolean)
        .join(" and "),
    [isCanceled, isDeleted]
  );

  const infoTextClass =
    "flex items-center gap-2 font-light leading-normal tracking-wide text-black font-jost text-mobile-xl md:text-xl";

  const userStatusChip = isOfflineUser ? (
    <Chip
      color="error"
      className="text-xs font-medium font-inter"
      icon={<span className="w-2 h-2 rounded-full bg-[#F04438]" />}
      label="Offline Customer"
    />
  ) : (
    <Chip
      color="success"
      icon={<span className="w-2 h-2 rounded-full bg-[#1BA879]" />}
      label="Online Customer"
    />
  );

  const deliveryInfoRows = [
    { label: "Name", value: userName },
    { label: "Email", value: userEmail },
    { label: "Address", value: userAddress },
    { label: "Phone Number", value: userPhone },
    { label: "Shipping State", value: shippingState },
  ];

  const extraInfoRows = [
    { label: "Address", value: offlineUserAddress },
    { label: "Phone Number", value: offlineUserPhone },
  ];

  const paymentRows = variant
    ? [
        { label: "Option", value: paymentOption },
        {
          label: paymentOption === "FULL" ? "Unit Cost" : "Total Cost",
          value: formatCurrency(variant?.prices || 0),
        },
        {
          label: "Amount Paid",
          value:
            paymentOption === "FULL"
              ? formatCurrency(amountPaid)
              : formatCurrency(variant?.amountToPay || 0),
        },
        {
          label: "Amount Remaining",
          value:
            paymentOption === "FULL"
              ? "NIL"
              : formatCurrency((variant?.prices || 0) - amountToPay),
        },
        { label: "Delivery Fee", value: formatCurrency(shippingFee) },
      ]
    : [
        { label: "Option", value: paymentOption },
        { label: "Total Cost", value: formatCurrency(total) },
        {
          label: "Amount Paid",
          value:
            paymentOption === "FULL"
              ? formatCurrency(total)
              : formatCurrency(total - amountToPay) || 0,
        },
        { label: "Amount Remaining", value: formatCurrency(amountToPay) || 0 },
      ];

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
          loading={isLoading}
          error={isError}
          onReload={refetch}
          loadingContent={<SportygalaxyLoadingIndicator />}
          // errorContent={<TableError onReload={() => refetch()} />}
          // emptyContent={</>}
          data={objectToArray(order)}
        >
          <div className="mt-10 space-y-10">
            <OrderProductList items={items} />

            {variant && <ProductDynamicKeyValueTio title="Variant" data={[variant]} />}

            {freeGift && (
              <OrderDynamicKeyValue
                title="Free Gift"
                data={onlineUser?.freeGift || []}
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

                <div className="mt-2 space-y-6">
                  <div className="space-y-3">
                    {paymentRows.map(({ label, value }) => (
                      <p key={label} className={infoTextClass}>
                        {label}: {value}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="font-bold text-black font-jost text-mobile-2xl md:text-2xl">
                  Delivery Information {userStatusChip}
                </p>

                <div className="mt-2 space-y-6">
                  {user && (
                    <div className="space-y-3">
                      {deliveryInfoRows.map(({ label, value }) => (
                        <p key={label} className={infoTextClass}>
                          {label}: {value}
                        </p>
                      ))}
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
                      {extraInfoRows.map(({ label, value }) => (
                        <p key={label} className={infoTextClass}>
                          {label}: {value}
                        </p>
                      ))}
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
