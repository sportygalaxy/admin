import { ApiOrderStoreSlice } from "@/api/ApiOrderStoreSlice";
import BackButton from "@/common/BackButton";
import LoadingContent from "@/common/LoadingContent/LoadingContent";
import SportygalaxyLoadingIndicator from "@/common/Loading/SportygalaxyLoadingIndicator";
import WatermarkOverlay from "@/common/WatermarkOverlay";
import { ORDER_STATUS } from "@/constants/enums";
import { formatCurrency } from "@/utils/currencyUtils";
import { calculateTimeAgo, transformDate } from "@/utils/dateUtils";
import { objectToArray } from "@/utils/ObjectUtils";
import { getOrderStatusDetails } from "@/utils/utils";
import { Chip, Divider, Typography } from "@mui/material";
import { Calendar, CreditCardShield, Package, Truck02, User01 } from "@untitled-ui/icons-react";
import { FC, type ReactNode, useMemo } from "react";
import { useParams } from "react-router-dom";
import OrderDeleteButton from "./OrderDeleteButton";
import OrderDynamicKeyValue from "./OrderDynamicKeyValue";
import { calculateCartTotals } from "./order.helper";
import OrderProductList from "./OrderProductList";
import OrderStatusAssignModal from "./OrderStatusAssignModal";

interface OrderDetailProps {}

const toAmount = (value: unknown) => {
  const parsedValue = Number(value || 0);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const displayValue = (
  value: unknown,
  fallback: string = "N/A"
): string => {
  if (value === 0) {
    return "0";
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
};

const SummaryCard = ({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) => (
  <div className="rounded-[24px] border border-[#EAECF0] bg-white p-5 shadow-sm">
    <Typography color="grey.500" className="text-xs font-semibold uppercase tracking-[0.08em] font-inter">
      {label}
    </Typography>
    <Typography color="grey.900" className="mt-3 font-crimson text-3xl font-bold">
      {value}
    </Typography>
    {helper ? (
      <Typography color="grey.600" className="mt-2 text-sm font-inter">
        {helper}
      </Typography>
    ) : null}
  </div>
);

const SectionCard = ({
  icon,
  title,
  description,
  children,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) => (
  <section className="rounded-[28px] border border-[#EAECF0] bg-white p-6 shadow-sm lg:p-7">
    <div className="mb-6 flex items-start gap-3">
      {icon ? (
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#101828] text-white">
          {icon}
        </div>
      ) : null}
      <div>
        <Typography color="grey.900" className="font-crimson text-2xl font-bold">
          {title}
        </Typography>
        <Typography color="grey.600" className="mt-1 text-sm font-inter">
          {description}
        </Typography>
      </div>
    </div>
    {children}
  </section>
);

const DetailRow = ({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: React.ReactNode;
  highlighted?: boolean;
}) => (
  <div className="flex items-start justify-between gap-5 rounded-2xl border border-[#EAECF0] bg-[#FCFCFD] px-4 py-4">
    <Typography color="grey.600" className="text-sm font-medium font-inter">
      {label}
    </Typography>
    <Typography
      color={highlighted ? "grey.900" : "grey.700"}
      className={`text-right font-inter ${
        highlighted ? "text-base font-semibold" : "text-sm font-medium"
      }`}
    >
      {value}
    </Typography>
  </div>
);

const PaymentProgress = ({
  paid,
  total,
}: {
  paid: number;
  total: number;
}) => {
  const percentage =
    total > 0 ? Math.min(100, Math.max(0, (paid / total) * 100)) : 0;

  return (
    <div className="rounded-[24px] border border-[#EAECF0] bg-[#FCFCFD] p-5">
      <div className="flex items-center justify-between gap-4">
        <Typography color="grey.700" className="text-sm font-medium font-inter">
          Payment completion
        </Typography>
        <Typography color="grey.900" className="text-sm font-semibold font-inter">
          {percentage.toFixed(0)}%
        </Typography>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#EAECF0]">
        <div
          className="h-full rounded-full bg-[#101828]"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <Typography color="grey.600" className="mt-2 text-sm font-inter">
        {formatCurrency(paid)} received out of {formatCurrency(total)}.
      </Typography>
    </div>
  );
};

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
    id: orderId,
    user: onlineUser,
    offlineUser,
    variant,
    total = 0,
    amountToPay = 0,
    amountPaid = 0,
    shippingFee = 0,
    shippingState,
    status = "",
    paymentOption = "",
    items = [],
    createdAt,
    updatedAt,
    deletedAt,
    isDeleted: rawIsDeleted,
  } = order || {};

  const user = onlineUser || offlineUser || {};
  const isOfflineUser = !onlineUser;
  const isHasExtraInfo = Boolean(onlineUser && offlineUser);
  const freeGift = onlineUser?.freeGift || null;
  const cartMetrics = useMemo(() => calculateCartTotals(items), [items]);

  const linePricing = useMemo(() => {
    const safeItems = Array.isArray(items) ? items : [];

    return safeItems.reduce(
      (acc, item: any) => {
        const quantity = toAmount(item?.quantity);
        const regularUnitPrice = toAmount(item?.product?.price);
        const promotionalUnitPrice =
          toAmount(item?.product?.salesPrice) > 0
            ? toAmount(item?.product?.salesPrice)
            : regularUnitPrice;

        acc.catalogRegularSubtotal += regularUnitPrice * quantity;
        acc.catalogSalesSubtotal += promotionalUnitPrice * quantity;

        return acc;
      },
      {
        catalogRegularSubtotal: 0,
        catalogSalesSubtotal: 0,
      }
    );
  }, [items]);

  const userName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Guest customer";
  const userEmail = user?.email || "N/A";
  const userAddress = user?.address || "N/A";
  const userPhone = user?.phone || "N/A";

  const offlineUserAddress = offlineUser?.address || "N/A";
  const offlineUserPhone = offlineUser?.phone || "N/A";

  const isDeleted = rawIsDeleted ?? Boolean(deletedAt);
  const isCanceled = status === ORDER_STATUS.CANCELED;
  const isDisabled = isDeleted || isCanceled;

  const dynamicText = useMemo(
    () =>
      [isDeleted ? "ORDER DELETED" : null, isCanceled ? "ORDER CANCELED" : null]
        .filter(Boolean)
        .join(" and "),
    [isCanceled, isDeleted]
  );

  const normalizedOutstandingBalance =
    paymentOption === "FULL" ? 0 : Math.max(toAmount(amountToPay), 0);
  const configuredPlanTotal = toAmount(variant?.prices);
  const fallbackAmountPaid =
    paymentOption === "FULL"
      ? Math.max(toAmount(total), configuredPlanTotal)
      : Math.max(toAmount(total) - normalizedOutstandingBalance, 0);
  const normalizedAmountPaid =
    toAmount(amountPaid) > 0 ? toAmount(amountPaid) : fallbackAmountPaid;
  const recordedOrderValue = Math.max(
    toAmount(total),
    configuredPlanTotal,
    normalizedAmountPaid + normalizedOutstandingBalance
  );
  const catalogSavings = Math.max(
    linePricing.catalogRegularSubtotal - linePricing.catalogSalesSubtotal,
    0
  );

  const { colorClass, formattedStatus } = getOrderStatusDetails(status);

  const deliveryInfoRows = [
    { label: "Customer Name", value: userName },
    { label: "Email", value: userEmail },
    { label: "Address", value: userAddress },
    { label: "Phone Number", value: userPhone },
    { label: "Shipping State", value: displayValue(shippingState, "Not specified") },
  ];

  const extraInfoRows = [
    { label: "Alternate Address", value: offlineUserAddress },
    { label: "Alternate Phone Number", value: offlineUserPhone },
  ];

  const paymentRows = [
    {
      label: "Payment Plan",
      value: paymentOption ? paymentOption : "Not specified",
    },
    { label: "Recorded Order Value", value: formatCurrency(recordedOrderValue) },
    { label: "Amount Paid", value: formatCurrency(normalizedAmountPaid) },
    {
      label: "Outstanding Balance",
      value:
        paymentOption === "FULL"
          ? "Fully paid"
          : formatCurrency(normalizedOutstandingBalance),
    },
    { label: "Shipping Fee", value: formatCurrency(shippingFee) },
    {
      label: "Configured Full Price",
      value: configuredPlanTotal ? formatCurrency(configuredPlanTotal) : "N/A",
    },
    {
      label: "Configured Initial Installment",
      value:
        toAmount(variant?.amountToPay) > 0
          ? formatCurrency(variant?.amountToPay)
          : "N/A",
    },
    {
      label: "Installment Split",
      value: displayValue(variant?.paymentSplitValue, "N/A"),
    },
  ];

  const systemRows = [
    { label: "Order ID", value: displayValue(orderId, "Unavailable") },
    {
      label: "Created On",
      value: createdAt ? transformDate(createdAt) : "N/A",
    },
    {
      label: "Last Updated",
      value: updatedAt ? transformDate(updatedAt) : "N/A",
    },
    {
      label: "Deleted On",
      value: deletedAt ? transformDate(deletedAt) : "Not deleted",
    },
    {
      label: "Created Relative",
      value: createdAt ? calculateTimeAgo(createdAt) : "N/A",
    },
  ];

  return (
    <>
      <WatermarkOverlay isVisible={isDisabled} text={dynamicText} />

      <div className="container-wrapper py-[30px]">
        <div className="space-y-5">
          <BackButton />

          <section className="overflow-hidden rounded-[32px] border border-[#101828] bg-white shadow-sm">
            <div className="bg-[#101828] px-6 py-8 text-white lg:px-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-4">
                  <div>
                    <Typography className="font-inter text-xs font-semibold uppercase tracking-[0.1em] text-white/70">
                      Order record
                    </Typography>
                    <Typography className="mt-2 font-crimson text-4xl font-bold text-white">
                      {displayValue(orderId, id)}
                    </Typography>
                    <Typography className="mt-2 text-sm font-inter text-white/80">
                      Production-ready overview of order status, pricing, and payment
                      progress.
                    </Typography>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Chip
                      label={formattedStatus || "UNKNOWN"}
                      className={`!border !border-white/10 !bg-white/10 !font-semibold !font-inter !text-white ${colorClass}`}
                      variant="outlined"
                    />
                    <Chip
                      label={paymentOption ? `${paymentOption} payment` : "Payment option unavailable"}
                      className="!border !border-white/10 !bg-white/10 !font-semibold !font-inter !text-white"
                      variant="outlined"
                    />
                    <Chip
                      label={isOfflineUser ? "Offline customer" : "Registered customer"}
                      className="!border !border-white/10 !bg-white/10 !font-semibold !font-inter !text-white"
                      variant="outlined"
                    />
                    {isDeleted ? (
                      <Chip
                        label="Deleted"
                        className="!border !border-white/10 !bg-white/10 !font-semibold !font-inter !text-white"
                        variant="outlined"
                      />
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[360px]">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <Typography className="text-xs font-semibold uppercase tracking-[0.08em] text-white/70 font-inter">
                      Customer
                    </Typography>
                    <Typography className="mt-2 text-base font-semibold text-white font-inter">
                      {userName}
                    </Typography>
                    <Typography className="mt-1 text-sm text-white/75 font-inter break-all">
                      {userEmail}
                    </Typography>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <Typography className="text-xs font-semibold uppercase tracking-[0.08em] text-white/70 font-inter">
                      Created
                    </Typography>
                    <Typography className="mt-2 text-base font-semibold text-white font-inter">
                      {createdAt ? transformDate(createdAt) : "N/A"}
                    </Typography>
                    <Typography className="mt-1 text-sm text-white/75 font-inter">
                      {createdAt ? calculateTimeAgo(createdAt) : "No timestamp"}
                    </Typography>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 sm:col-span-2">
                    <Typography className="text-xs font-semibold uppercase tracking-[0.08em] text-white/70 font-inter">
                      Payment snapshot
                    </Typography>
                    <Typography className="mt-2 text-base font-semibold text-white font-inter">
                      Paid {formatCurrency(normalizedAmountPaid)} / {formatCurrency(recordedOrderValue)}
                    </Typography>
                    <Typography className="mt-1 text-sm text-white/75 font-inter">
                      Balance:{" "}
                      {paymentOption === "FULL"
                        ? "Fully paid"
                        : formatCurrency(normalizedOutstandingBalance)}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 bg-[#F8FAFC] px-6 py-6 md:grid-cols-2 xl:grid-cols-4 lg:px-8">
              <SummaryCard
                label="Recorded Order Value"
                value={formatCurrency(recordedOrderValue)}
                helper="Authoritative order amount derived from the recorded order data."
              />
              <SummaryCard
                label="Amount Paid"
                value={formatCurrency(normalizedAmountPaid)}
                helper="Money already received against this order."
              />
              <SummaryCard
                label="Outstanding Balance"
                value={
                  paymentOption === "FULL"
                    ? "₦0.00"
                    : formatCurrency(normalizedOutstandingBalance)
                }
                helper={
                  paymentOption === "FULL"
                    ? "This order is marked as full payment."
                    : "Remaining amount still expected from the customer."
                }
              />
              <SummaryCard
                label="Items / Quantity"
                value={`${cartMetrics.totalItemInCart} / ${cartMetrics.totalItemQtyInAllCart}`}
                helper="Distinct line items and total quantity across the order."
              />
            </div>
          </section>
        </div>

        <LoadingContent
          loading={isLoading}
          error={isError}
          onReload={refetch}
          loadingContent={<SportygalaxyLoadingIndicator />}
          data={objectToArray(order)}
        >
          <div className="mt-10 space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.25fr,1fr]">
              <SectionCard
                icon={<CreditCardShield width={20} height={20} />}
                title="Payment Breakdown"
                description="Recorded payment facts for this order, including installment configuration where available."
              >
                <div className="space-y-4">
                  <PaymentProgress
                    paid={normalizedAmountPaid}
                    total={recordedOrderValue}
                  />

                  <div className="grid gap-3 md:grid-cols-2">
                    {paymentRows.map(({ label, value }) => (
                      <DetailRow
                        key={label}
                        label={label}
                        value={value}
                        highlighted={
                          label === "Recorded Order Value" ||
                          label === "Amount Paid" ||
                          label === "Outstanding Balance"
                        }
                      />
                    ))}
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                icon={<Package width={20} height={20} />}
                title="Pricing Intelligence"
                description="Comparison between catalog pricing and the order’s recorded payment numbers."
              >
                <div className="space-y-3">
                  <DetailRow
                    label="Catalog Regular Subtotal"
                    value={formatCurrency(linePricing.catalogRegularSubtotal)}
                    highlighted
                  />
                  <DetailRow
                    label="Catalog Sales Subtotal"
                    value={formatCurrency(linePricing.catalogSalesSubtotal)}
                    highlighted
                  />
                  <DetailRow
                    label="Catalog Savings"
                    value={formatCurrency(catalogSavings)}
                  />
                  <DetailRow
                    label="Recorded Order Value"
                    value={formatCurrency(recordedOrderValue)}
                  />
                  <DetailRow
                    label="Shipping Fee"
                    value={formatCurrency(shippingFee)}
                  />
                </div>

                <Divider className="!my-5" />

                <Typography color="grey.600" className="text-sm font-inter leading-7">
                  Catalog pricing is computed from the current product records attached to
                  the order items. Recorded payment values above come directly from the
                  order and remain the authoritative figures for collection and balance
                  tracking.
                </Typography>
              </SectionCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
              <SectionCard
                icon={<Truck02 width={20} height={20} />}
                title="Customer And Delivery"
                description="Fulfilment contact details and delivery instructions captured for this order."
              >
                <div className="grid gap-3 md:grid-cols-2">
                  {deliveryInfoRows.map(({ label, value }) => (
                    <DetailRow key={label} label={label} value={value} />
                  ))}
                </div>

                {isHasExtraInfo ? (
                  <>
                    <Divider className="!my-5" />
                    <Typography color="grey.900" className="font-crimson text-xl font-bold">
                      Additional Contact Information
                    </Typography>
                    <Typography color="grey.600" className="mt-1 text-sm font-inter">
                      Supplemental contact data stored alongside the linked user record.
                    </Typography>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {extraInfoRows.map(({ label, value }) => (
                        <DetailRow key={label} label={label} value={value} />
                      ))}
                    </div>
                  </>
                ) : null}
              </SectionCard>

              <SectionCard
                icon={<User01 width={20} height={20} />}
                title="Order Timeline And System"
                description="Audit-friendly timestamps and order metadata."
              >
                <div className="space-y-3">
                  {systemRows.map(({ label, value }) => (
                    <DetailRow key={label} label={label} value={value} />
                  ))}
                </div>
              </SectionCard>
            </div>

            <OrderProductList items={items} />

            {variant ? (
              <SectionCard
                icon={<CreditCardShield width={20} height={20} />}
                title="Variant / Installment Configuration"
                description="Raw configuration data attached to this order variant or payment split."
              >
                <div className="grid gap-3 md:grid-cols-2">
                  {Object.entries(variant)
                    .filter(
                      ([key, value]) =>
                        key !== "id" &&
                        value !== null &&
                        value !== undefined &&
                        value !== ""
                    )
                    .map(([key, value]) => {
                      const normalizedLabel = key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (char) => char.toUpperCase());

                      const formattedValue =
                        key.toLowerCase().includes("price") ||
                        key === "prices" ||
                        key === "amountToPay"
                          ? formatCurrency(toAmount(value))
                          : displayValue(value);

                      return (
                        <DetailRow
                          key={key}
                          label={normalizedLabel}
                          value={formattedValue}
                        />
                      );
                    })}
                </div>
              </SectionCard>
            ) : null}

            {freeGift ? (
              <SectionCard
                icon={<Calendar width={20} height={20} />}
                title="Free Gift"
                description="Promotional gift information attached to the customer record for this order."
              >
                <OrderDynamicKeyValue title="Gift Details" data={freeGift || []} />
              </SectionCard>
            ) : null}

            <div className="flex flex-wrap items-center gap-4 rounded-[28px] border border-[#EAECF0] bg-white p-5 shadow-sm">
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
